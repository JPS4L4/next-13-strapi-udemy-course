import CardImage from "@/components/CardImage";
import PageHeader from "@/components/PageHeader";
import PagePagination from "@/components/PagePagination";
import { fetchApi } from "@/helpers/fetch-api";
import { Post } from "@/interfaces/post";

const getData = async (page: number) => {
  const path = "/posts";
  const urlParamsObject = {
    populate: "*",
    sort: { createdAt: "asc" },
    pagination: {
      page: page,
      pageSize: 2,
    },
  };

  const { data, meta } = await fetchApi(path, urlParamsObject);
  return {
    data,
    pagination: meta.pagination,
  };
};

interface Props {
  searchParams: {
    page?: string;
  };
}

const Blog = async ({ searchParams }: Props) => {
  const { page } = searchParams;

  let pageNumber = page ? parseInt(page, 10) : 1;

  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
    console.log(
      "valor no valido como parámetro de página, Se establece página 1"
    );
  }

  const { data, pagination } = await getData(pageNumber);
  return (
    <div className="space-y-8">
      <PageHeader text="Latest Posts!" />
      <PagePagination pagination={pagination} />
      <div className="flex items-center justify-between gap-6">
        {data.map((post: Post) => (
          <CardImage key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
