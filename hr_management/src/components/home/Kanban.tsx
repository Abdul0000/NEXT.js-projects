import { MailIcon, MoreVerticalIcon, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface KanbanProps {
  // isOpen?: boolean;
  employee_name: string;
  job_title: string;
  work_email: string;
  work_mobile: string;
  image_url: string;
  id: string;
  index?: number;
  check?: string;
}

const Kanban = ({
  employee_name,
  job_title,
  work_email,
  work_mobile,
  image_url,
  id,
  check,
  index,
}: KanbanProps) => {
  return (
    <div
      className={`
        p-0
        lg:w-[25rem]
      
        h-[150px] 
        border border-gray-300 
        ${check === "group" && index !== undefined && index > 0 && "border-t-0"}
        ${image_url != "/no_image.JPG" && "rounded-l"}
      `}
    >
      <div className="flex justify-between items-start">
        <Link href={`/employee_update/${id}`} className="flex w-full">
          <div className={`relative h-[148.5px] w-[180px] md:w-[12.5rem] ${image_url === "/no_image.JPG" && "h-[148px]"}`}>
            <Image
              src={image_url}
              alt="kanban"
              fill
              priority={image_url === "/no_image.JPG"} 
              sizes="(max-width: 768px) 180px, (min-width: 768px) 200px"
              className="
                object-fit rounded 
                absolute
                m-0
                p-0
              "
            />
          </div>
          <div className="flex flex-col justify-start pl-2 pt-2 w-full">
            <h3 className="font-semibold text-neutral-600 text-[0.875rem] sm:text-[1rem]">
              {employee_name}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500">{job_title}</p>
            <div className="pt-2 flex gap-x-1 items-center">
              <MailIcon className="w-3 h-3 text-blue-800" />
              <p className="text-[10px] sm:text-[0.75rem] text-neutral-500 overflow-hidden truncate">
                {work_email}
              </p>
            </div>
            <div className="pt-2 flex gap-x-1 items-center">
              <Phone className="w-3 h-3 text-blue-800" />
              <p className="text-[0.625rem] sm:text-[0.75rem] text-neutral-500 overflow-hidden truncate">
                {work_mobile}
              </p>
            </div>
          </div>
        </Link>

        <button
          onClick={(e) => e.nativeEvent.stopPropagation()}
          className="m-1 p-1 rounded hover:bg-slate-100"
        >
          <MoreVerticalIcon className="size-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default Kanban;

