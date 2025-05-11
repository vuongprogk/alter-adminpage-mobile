const User = ({
  params,
}: {
  params: {
    userId: string;
  };
}) => {
  return <div>User id{params.userId}</div>;
};

export default User;
