import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono"
import { client } from "@/lib/rpc"
import { toast } from "sonner";

type ResponseType= InferResponseType<typeof client.api.members[":memberId"]["$delete"],200>
type RequestType= InferRequestType<typeof client.api.members[":memberId"]["$delete"]>

export const useDeleteMemeber= ()=>{
    const queryClient= useQueryClient()
    const mutation= useMutation<ResponseType,Error,RequestType>({
        mutationFn: async({param})=>{
            const response= await client.api.members[":memberId"]["$delete"]({param});
            if(!response.ok){
                throw new Error("Fail to delete member")
            }
            return await response.json();
        },
        onSuccess:()=>{
            toast.success("Member deleted")
            queryClient.invalidateQueries({queryKey:["members"]})
        },
        onError:()=>{
            toast.error("Fail to detele member")
        }

    })
    return mutation
}