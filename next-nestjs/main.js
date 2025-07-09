/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_controller_1 = __webpack_require__(5);
const app_service_1 = __webpack_require__(6);
// import { StudentModule } from '../student/student.module';
const report_module_1 = __webpack_require__(7);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [report_module_1.ReportModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_service_1 = __webpack_require__(6);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return this.appService.getData();
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let AppService = class AppService {
    getData() {
        return { message: 'Hello how are you' };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const report_service_1 = __webpack_require__(8);
const email_gateway_1 = __webpack_require__(26);
let ReportModule = class ReportModule {
};
exports.ReportModule = ReportModule;
exports.ReportModule = ReportModule = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [report_service_1.ReportService, email_gateway_1.EmailGateway]
    })
], ReportModule);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var ReportService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const bullmq_1 = __webpack_require__(9);
const node_cron_1 = tslib_1.__importDefault(__webpack_require__(10));
const drizzle_orm_1 = __webpack_require__(11);
const db_1 = __webpack_require__(12);
const schema_1 = __webpack_require__(16);
const connection_1 = tslib_1.__importDefault(__webpack_require__(20));
const ai_1 = __webpack_require__(22);
const email_1 = __webpack_require__(24);
const email_gateway_1 = __webpack_require__(26);
let ReportService = ReportService_1 = class ReportService {
    constructor(emailGateway) {
        this.emailGateway = emailGateway;
        this.logger = new common_1.Logger(ReportService_1.name);
    }
    async onModuleInit() {
        const medicalReportQueue = new bullmq_1.Queue('medicalReportQueue', {
            connection: connection_1.default,
            defaultJobOptions: {
                attempts: 3,
                backoff: { type: 'exponential', delay: 10000 },
                removeOnComplete: true,
                removeOnFail: false,
            },
        });
        node_cron_1.default.schedule('*/5 * * * *', async () => {
            this.logger.log('🔁 Cron: Checking for unanalyzed medical reports...');
            try {
                const reportsToProcess = await db_1.db
                    .select({
                    reportId: schema_1.medicalReports.id,
                    patientId: schema_1.medicalReports.patientId,
                    patientEmail: schema_1.users.email,
                })
                    .from(schema_1.medicalReports)
                    .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.users.id, schema_1.medicalReports.patientId))
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.medicalReports.analyzed, false), (0, drizzle_orm_1.isNull)(schema_1.medicalReports.analysisError)));
                for (const report of reportsToProcess) {
                    if (!report.patientEmail) {
                        await db_1.db.update(schema_1.medicalReports).set({
                            emailError: 'Patient email missing',
                            updatedAt: new Date(),
                        }).where((0, drizzle_orm_1.eq)(schema_1.medicalReports.id, report.reportId));
                        this.logger.warn(`⚠️ Skipping report ${report.reportId}: Missing email.`);
                        continue;
                    }
                    try {
                        await medicalReportQueue.add(`analyze:${report.reportId}`, {
                            reportId: report.reportId,
                            patientId: report.patientId,
                            patientEmail: report.patientEmail,
                        }, { jobId: `analyze:${report.reportId}` });
                        this.logger.log(`📨 Enqueued report ${report.reportId}`);
                    }
                    catch (error) {
                        this.logger.error(`❌ Failed to enqueue ${report.reportId}`, error);
                        await db_1.db.update(schema_1.medicalReports).set({
                            analysisError: 'Enqueue failed: ' + String(error),
                            updatedAt: new Date(),
                        }).where((0, drizzle_orm_1.eq)(schema_1.medicalReports.id, report.reportId));
                    }
                }
            }
            catch (err) {
                this.logger.error('❌ Cron error:', err);
            }
        });
        const worker = new bullmq_1.Worker('medicalReportQueue', async (job) => {
            const { reportId, patientEmail } = job.data;
            try {
                this.logger.log(`🧠 Processing report ${reportId}`);
                const [report] = await db_1.db
                    .select()
                    .from(schema_1.medicalReports)
                    .where((0, drizzle_orm_1.eq)(schema_1.medicalReports.id, reportId))
                    .limit(1);
                if (!report)
                    throw new common_1.NotFoundException(`Report ${reportId} not found`);
                const analysis = await (0, ai_1.analyzeReportWithAI)(report.content);
                await db_1.db.update(schema_1.medicalReports).set({
                    analysis,
                    analyzed: true,
                    analysisError: null,
                    updatedAt: new Date(),
                }).where((0, drizzle_orm_1.eq)(schema_1.medicalReports.id, reportId));
                if (patientEmail) {
                    const subject = 'Your Medical Report Analysis is Ready';
                    const body = `<p>Dear Patient,</p><p>Your report has been analyzed.</p><pre style="font-family: monospace; font-size: 13px; white-space: pre-wrap;">${analysis.summary}</pre><p>Regards,<br/>HealthCare AI</p>`;
                    await (0, email_1.sendReportEmail)(patientEmail, subject, body);
                    this.emailGateway.notifyEmailSent(reportId, patientEmail);
                    this.logger.log(`📧 Email sent to ${patientEmail}`);
                }
                this.logger.log(`✅ Report ${reportId} processed.`);
            }
            catch (err) {
                this.logger.error(`❌ Worker failed for report ${reportId}:`, err);
                await db_1.db.update(schema_1.medicalReports).set({
                    analysisError: String(err),
                    updatedAt: new Date(),
                }).where((0, drizzle_orm_1.eq)(schema_1.medicalReports.id, reportId));
                throw err;
            }
        }, {
            connection: connection_1.default,
            concurrency: 2,
        });
        worker.on('completed', (job) => this.logger.log(`✅ Job ${job.id} completed.`));
        worker.on('failed', (job, err) => this.logger.error(`❌ Job ${job?.id} failed:`, err));
        worker.on('error', (err) => this.logger.error('🚨 Worker error:', err));
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = ReportService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof email_gateway_1.EmailGateway !== "undefined" && email_gateway_1.EmailGateway) === "function" ? _a : Object])
], ReportService);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("bullmq");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("node-cron");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("drizzle-orm");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.db = void 0;
__webpack_require__(13); // Ensure this runs before anything else uses process.env
const pg_1 = __webpack_require__(14);
const node_postgres_1 = __webpack_require__(15);
// Create a pg Pool instance using the connection string from environment variables.
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Pass the Pool instance to drizzle.
exports.db = (0, node_postgres_1.drizzle)(pool);
// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';
// export const db = drizzle(process.env.DATABASE_URL!);


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("pg");

/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("drizzle-orm/node-postgres");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.medicalReports = exports.patientInsertSchema = exports.patients = exports.doctorInsertSchema = exports.doctors = exports.users = void 0;
const tslib_1 = __webpack_require__(4);
const pg_core_1 = __webpack_require__(17);
const drizzle_zod_1 = __webpack_require__(18);
const v4_1 = tslib_1.__importDefault(__webpack_require__(19));
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.text)('email').unique().notNull(),
    passwordHash: (0, pg_core_1.text)('password_hash').notNull(),
    salt: (0, pg_core_1.text)("salt").notNull(),
    role: (0, pg_core_1.text)('role', { enum: ['admin', 'doctor', 'patient'] }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow(),
}, (users) => [
    (0, pg_core_1.uniqueIndex)("email_idx").on(users.email),
]);
// Doctors table: profile info linked to users.id
exports.doctors = (0, pg_core_1.pgTable)('doctors', {
    id: (0, pg_core_1.uuid)('id').primaryKey().references(() => exports.users.id),
    name: (0, pg_core_1.text)('name').notNull(),
    department: (0, pg_core_1.text)('department').notNull(),
    gender: (0, pg_core_1.text)("gender", { enum: ["male", "female", "other"] }),
    specialization: (0, pg_core_1.text)('specialization'),
    phone: (0, pg_core_1.text)('phone').notNull(),
    address: (0, pg_core_1.text)('address').notNull(),
});
exports.doctorInsertSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).extend({
    id: v4_1.default.uuid(),
    name: v4_1.default.string().min(2, { message: "Minimum 2 characters" }),
    department: v4_1.default.string().min(2, { message: "Minimum 2 characters" }),
    specialization: v4_1.default.string(),
    gender: v4_1.default.enum(["male", "female", "other"]),
    phone: (0, pg_core_1.text)('phone').notNull(),
    address: (0, pg_core_1.text)('address').notNull(),
});
exports.patients = (0, pg_core_1.pgTable)('patients', {
    id: (0, pg_core_1.uuid)('id').primaryKey().references(() => exports.users.id),
    name: (0, pg_core_1.text)('name').notNull(),
    gender: (0, pg_core_1.text)('gender', { enum: ['male', 'female', 'other'] }).notNull(),
    phone: (0, pg_core_1.text)('phone').notNull(),
    address: (0, pg_core_1.text)('address').notNull(),
    dateOfBirth: (0, pg_core_1.date)('date_of_birth'),
    assignedDoctorId: (0, pg_core_1.uuid)('assigned_doctor_id').references(() => exports.doctors.id),
});
exports.patientInsertSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).extend({
    name: v4_1.default.string().min(1, "Name is required"),
    gender: v4_1.default.enum(['male', 'female', 'other']),
    phone: v4_1.default.string().min(2, "Phone is required"),
    address: v4_1.default.string().min(2, "Address is required"),
    dateOfBirth: v4_1.default.string().or(v4_1.default.date()), // handle both ISO string or Date object
    assignedDoctorId: v4_1.default.uuid({ message: "Invalid Doctor ID" }),
});
exports.medicalReports = (0, pg_core_1.pgTable)("medical_reports", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    patientId: (0, pg_core_1.uuid)("patient_id").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    analysis: (0, pg_core_1.jsonb)("analysis"),
    analyzed: (0, pg_core_1.boolean)("analyzed").default(false),
    analysisError: (0, pg_core_1.text)("analysis_error"),
    emailError: (0, pg_core_1.text)("email_error"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("drizzle-orm/pg-core");

/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("drizzle-zod");

/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("zod/v4");

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
// server/bullmq/connection.ts
const ioredis_1 = __webpack_require__(21);
__webpack_require__(13); // Ensure .env variables are loaded
// Create a single, reusable Redis connection instance for BullMQ
const redisConnection = new ioredis_1.Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null, // <-- THIS IS THE CRUCIAL LINE
    // If you're using `rediss://` in your URL, ioredis typically handles TLS.
    // However, if explicitly needed for some setups, you might add:
    // tls: {}, // An empty object enables TLS/SSL
    // Additional Redis connection options can go here
});
redisConnection.on('connect', () => console.log('Redis connected successfully for BullMQ!'));
redisConnection.on('error', (err) => console.error('Redis connection error:', err));
exports["default"] = redisConnection;


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("ioredis");

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.analyzeReportWithAI = analyzeReportWithAI;
// import { convert } from 'html-to-text';
const genai_1 = __webpack_require__(23);
const ai = new genai_1.GoogleGenAI({ apiKey: "AIzaSyDJS6gerFvUj0sMXiWNXjnmjL-qkKh-u7w" });
async function analyzeReportWithAI(content) {
    console.log(`[AI Service] Analyzing content (first 80 chars): "${content.substring(0, Math.min(content.length, 80))}"...`);
    const pattern = `{
  "prompt": "Generate a medical report summary using the following structure and templates. Fill placeholders with actual patient data from the provided medical records. Maintain all styling and formatting rules strictly.",
  "requirements": {
    "format": "semantic HTML only",
    "styling": "inline styles only",
    "layout": "printable A4",
    "sections": ["Patient Overview", "Vitals", "Labs", "Diagnoses", "Alerts", "Recommendations"]
  },
  "template": {
    "container": "<div style='font-family: Arial, sans-serif; font-size: 12px; line-height: 1.2;'>{sections}</div>",
    "sections": {
      "header": "<h1 style='font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 12px;'>Medical Report Summary</h1>",
      "patientOverview": "<h2 style='font-size: 14px; background-color: #f5f5f5; padding: 4px 8px; margin: 8px 0;'>Patient Overview</h2><table style='width: 100%; border-collapse: collapse;'>{rows}</table>",
      "vitals": "<h2 style='font-size: 14px; background-color: #f5f5f5; padding: 4px 8px; margin: 8px 0;'>Vitals</h2><table style='width: 100%; border-collapse: collapse;'><thead><tr><th style='padding: 4px 8px; border: 1px solid #ddd; text-align: left;'>Parameter</th><th style='padding: 4px 8px; border: 1px solid #ddd; text-align: left;'>Value</th><th style='padding: 4px 8px; border: 1px solid #ddd; text-align: left;'>Range</th><th style='padding: 4px 8px; border: 1px solid #ddd; text-align: left;'>Status</th></tr></thead><tbody>{rows}</tbody></table>",
      "labs": "<h2 style='font-size: 14px; background-color: #f5f5f5; padding: 4px 8px; margin: 8px 0;'>Labs</h2><table style='width: 100%; border-collapse: collapse;'><thead><tr><th style='padding: 4px 8px; border: 1px solid #ddd; text-align: left;'>Test</th><th style='padding: 4px 8px; border: 1px solid #ddd; text-align: left;'>Value</th><th style='padding: 4px 8px; border: 1px solid #ddd; text-align: left;'>Range</th><th style='padding: 4px 8px; border: 1px solid #ddd; text-align: left;'>Status</th></tr></thead><tbody>{rows}</tbody></table>",
      "diagnoses": "<h2 style='font-size: 14px; background-color: #f5f5f5; padding: 4px 8px; margin: 8px 0;'>Diagnoses</h2><ul style='margin: 4px 0; padding-left: 20px;'>{items}</ul>",
      "alerts": "<h2 style='font-size: 14px; background-color: #f5f5f5; padding: 4px 8px; margin: 8px 0;'>Alerts</h2><table style='width: 100%; border-collapse: collapse;'>{rows}</table>",
      "recommendations": "<h2 style='font-size: 14px; background-color: #f5f5f5; padding: 4px 8px; margin: 8px 0;'>Recommendations</h2><ul style='margin: 4px 0; padding-left: 20px;'>{items}</ul>"
    },
    "rowTemplates": {
      "patientOverview": "<tr><td style='padding: 4px 8px; border: 1px solid #ddd; width: 25%;'>{fieldName}</td><td style='padding: 4px 8px; border: 1px solid #ddd;'>{fieldValue}</td></tr>",
      "vitals": "<tr><td style='padding: 4px 8px; border: 1px solid #ddd;'> {parameter</td><td style='padding: 4px 8px; border: 1px solid #ddd;'>{value}</td><td style='padding: 4px 8px; border: 1px solid #ddd;'>{range}</td><td style='padding: 4px 8px; border: 1px solid #ddd; color: {statusColor};'>{status}</td></tr>",
      "labs": "<tr><td style='padding: 4px 8px; border: 1px solid #ddd;'>{test}</td><td style='padding: 4px 8px; border: 1px solid #ddd;'>{value}</td><td style='padding: 4px 8px; border: 1px solid #ddd;'>{range}</td><td style='padding: 4px 8px; border: 1px solid #ddd; color: {statusColor};'>{status}</td></tr>",
      "alert": "<tr><td style='padding: 4px 8px; border: 1px solid #ffcccc; background-color: #fff5f5;'><strong>{alertType}:</strong> {alertContent}</td></tr>"
    },
    "itemTemplates": {
      "diagnosis": "<li>{diagnosis}</li>",
      "recommendation": "<li>{recommendation}</li>"
    }
  },
  "processing": {
    "analyze": ["extract relevant vitals/labs", "identify diagnoses", "flag critical values", "calculate risk score"],
    "riskScale": "1-5 (1=low, 5=emergency)"
  }
}`;
    const prompt = `
You are a highly specialized medical AI agent designed to assist doctors by analyzing raw medical reports.

Your task is to:
- Read and understand the full context of the medical report (clinical notes, lab results, patient history).
- Extract relevant vitals and lab values (e.g. BP, pulse, glucose, cholesterol).
- Summarize findings using medical terminology but in a form that is **quick and easy for doctors to review**.
- Detect any potential diagnosis or conditions.
- Flag critical markers.
- Compute a clinical risk score (1 = low risk, 5 = emergency).
- Recommend next steps (tests, follow-up, referral).

summary should:
Requirements:
- Format with proper sections: Patient Overview, Vitals, Labs, Diagnoses, Alerts, Recommendations.
- Use semantic HTML only (e.g., <h2>, <table>, <ul>, <li>).
- Apply clean inline styles (email-friendly, no external stylesheets).
- Ensure layout is printable (A4-friendly), clean, and readable.
- **Do NOT** use Markdown or code blocks.
- **Do NOT** include explanations or instructions in the output
- Stricly use modern medical table layout
- REMOVE Extra line spcaing 

**Format your response strictly as JSON** with only these two keys:

{
  "summary": "<div>
    Always use this structure ${pattern}
  </div>",

  "keywords": ["keyword1", "keyword2", ...]
}

Input example:
Patient is a 63 y/o female with COPD, HTN, T2DM, presents with SOB, Afib w/ RVR, dizziness, hypoxia, and abnormal labs (BNP, LDL, HbA1c, etc.). Include critical markers and recommendations.

Goal:
Generate a clean, styled summary ready for HTML email (e.g., via Resend), printable, and easy to read by physicians and patients alike.
Respond ONLY with valid JSON. Do NOT add explanations or other text.

---

Medical Report:
"""${content}"""
`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        const text = response.text;
        if (typeof text !== "string") {
            throw new Error("AI response did not return text.");
        }
        const clean = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
        const json = JSON.parse(clean);
        console.log(`[AI Service] Finished analysis.`);
        return json;
    }
    catch (error) {
        console.error(`[AI Service] Error during analysis:`, error);
        throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}


/***/ }),
/* 23 */
/***/ ((module) => {

module.exports = require("@google/genai");

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sendReportEmail = sendReportEmail;
const resend_1 = __webpack_require__(25);
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendReportEmail(to, subject, body) {
    // console.log("from env",process.env.FROM)
    // console.log("To",to)
    const result = await resend.emails.send({
        from: process.env.FROM,
        to,
        subject,
        html: body,
    });
    if (!result.data?.id) {
        console.error('[Email Service] Failed to send email:', result);
        throw new Error(`Failed to send email to ${to}`);
    }
    console.log(`[Email Service] Email sent to ${to}. ID: ${result.data.id}`);
}


/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("resend");

/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailGateway = void 0;
const tslib_1 = __webpack_require__(4);
const websockets_1 = __webpack_require__(27);
const socket_io_1 = __webpack_require__(28);
let EmailGateway = class EmailGateway {
    notifyEmailSent(reportId, email) {
        this.server.emit('email-sent', { reportId, email });
    }
};
exports.EmailGateway = EmailGateway;
tslib_1.__decorate([
    (0, websockets_1.WebSocketServer)(),
    tslib_1.__metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], EmailGateway.prototype, "server", void 0);
exports.EmailGateway = EmailGateway = tslib_1.__decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true })
], EmailGateway);


/***/ }),
/* 27 */
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("socket.io");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();

})();

/******/ })()
;