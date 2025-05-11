import { useQuery, useQueryClient } from "@tanstack/react-query";

const Users = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => {},
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
  return (
    <div>Users</div>
  )
}

export default Users
