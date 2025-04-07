"use client";

import Analytics from "@/components/analytics";
import PageLoader from "@/components/pageLoader";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-anaylitics";
import ProjectAvatar from "@/features/projects/components/projectAvatar";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import TaskViewSwicther from "@/features/tasks/components/task-view-swicther";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

const ProjectClientId = () => {
  const projectId = useProjectId();
  const { data, isLoading:isLoadingProject } = useGetProject({ projectId });
  const { data: analytics, isLoading:isLoadingAnalytics } = useGetProjectAnalytics({ projectId });
  const isLoading = isLoadingProject || isLoadingAnalytics;
  if (isLoading) return <PageLoader />;
  if (!data || !analytics) return null;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={data.name}
            image={data.imageUrl}
            className="size-8 text-lg"
          />
          <span className="truncate text-lg font-semibold">{data.name}</span>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href={`/workspaces/${data.workspaceId}/projects/${data.$id}/settings`}>
            <PencilIcon size={16} className="mr-1" />
            Edit Project
          </Link>
        </Button>
      </div>
      {analytics ?
      <Analytics data={analytics}/>
      : null }
      <TaskViewSwicther hideProjectFilter />
      </div>
  );
};

export default ProjectClientId;
