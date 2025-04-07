import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono"
import { client } from "@/lib/rpc"
import { toast } from "sonner";

type ResponseType= InferResponseType<typeof client.api.projects["$post"],200>
type RequestType= InferRequestType<typeof client.api.projects["$post"]>

export const useCreateProject= ()=>{
    const queryClient= useQueryClient()
    const mutation= useMutation<ResponseType,Error,RequestType>({
        mutationFn: async({form})=>{
            const response= await client.api.projects["$post"]({form});
            if(!response.ok){
                throw new Error("Fail to create project")
            }
            return await response.json();
        },
        onSuccess: () => {
            
            toast.success("Project created successfully!");
            queryClient.invalidateQueries({queryKey:["projects"]})
            // queryClient.setQueryData(["projects"], (oldData: ResponseType[] = []) => {
            //     return [...oldData, data];
            //   })
        },
        onError:()=>{
            toast.error("Fail to create project")
        }

    })
    return mutation
}