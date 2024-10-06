import CreateBlogForm from "@components/create-blog/CreateBlogForm";
import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";

export default withPageAuthRequired(async function CreateBlog() {
  const { accessToken } = await getAccessToken();
  const baseUrl = process.env.BACKEND_BASE_URL as string;
  const s3Url = process.env.S3_BUCKET_URL;
  return (
    <CreateBlogForm
      token={accessToken as string}
      baseUrl={baseUrl}
      s3Url={s3Url as string}
    />
  );
});
