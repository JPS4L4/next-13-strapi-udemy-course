import React from "react";
import { Post } from "@/interfaces/post";
import PageHeader from "@/components/PageHeader";
import { fetchApi } from "@/helpers/fetch-api";
import { formatDate } from "@/helpers/format-date";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

interface Props {
  params: {
    slug: string;
  };
}

interface TextBlock {
  text: string;
  bold?: boolean;
  italic?: boolean;
  type: "text";
}

interface ParagraphBlock {
  type: "paragraph";
  children: TextBlock[];
}

type BodyContent = ParagraphBlock[];

const getData = async (slug = "") => {
  const path = "/posts";
  const urlParamsObject = {
    populate: "*",
    filters: {
      slug: slug,
    },
  };
  const { data } = await fetchApi(path, urlParamsObject);
  return data[0];
};

const Slug = async ({ params }: Props) => {
  const { slug } = params;
  const post: Post = await getData(slug);

  if (!post) {
    return notFound();
  }

  const processBody = (bodyArray: BodyContent) => {
    return bodyArray
      .map((block) => {
        if (block.type === "paragraph") {
          return block.children
            .map((child) => {
              let text = child.text;

              if (child.bold) {
                text = `**${text}**`;
              }
              if (child.italic) {
                text = `*${text}*`;
              }

              return text;
            })
            .join("");
        }
        // Puedes manejar otros tipos aquí si los tienes en tu API, como 'heading', 'image', etc.
        return "";
      })
      .join("\n\n"); // Unir párrafos con doble salto de línea
  };

  const { title, description, body, createdAt, image } = post.attributes;
  const { url, width, height } = image.data.attributes.formats.medium;

  const bodyContent = processBody(body as BodyContent);

  return (
    <div className="space-y-8">
      <PageHeader text={title} />
      <div className="flex justify-between">
        <p className="text-gray-500 mt-4">{formatDate(createdAt)}</p>
        <Link
          href="/blog"
          className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300"
        >
          Volver
        </Link>
      </div>

      <Image
        className="h-auto rounded-lg"
        src={url}
        alt={`imagen de ${title}`}
        width={width}
        height={height}
      />
      <p className="mb-3 text-gray-500 dark:text-gray-400 first-line:uppercase first-line:tracking-widest ">
        {description}
      </p>
      <div className="prose dark:bg-slate-200 dark:p-4 rounded-xl">
        <ReactMarkdown>{bodyContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Slug;
