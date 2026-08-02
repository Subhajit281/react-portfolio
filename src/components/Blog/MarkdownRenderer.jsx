import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import { slugifyHeading } from "../../utils/slugify";

function HeadingFactory(Tag) {
  return function Heading({ children }) {
    const text = String(children);
    const id = slugifyHeading(text);
    return (
      <Tag id={id} className="scroll-mt-24 group relative">
        <a
          href={`#${id}`}
          className="absolute -left-5 opacity-0 group-hover:opacity-100 text-gray-400 no-underline"
          aria-hidden="true"
        >
          #
        </a>
        {children}
      </Tag>
    );
  };
}

/**
 * Renders markdown body content with:
 * - GFM (tables, strikethrough, task lists, autolinks)
 * - Syntax-highlighted, copyable code blocks
 * - Anchor ids on h2/h3 (matched by useTableOfContents + slugifyHeading)
 *
 * Wrap the output element with a ref and pass it to useTableOfContents
 * for scrollspy support (see BlogDetails.jsx).
 */
export default function MarkdownRenderer({ content }) {
  // NOTE: Tailwind's JIT scanner requires literal class strings — don't
  // interpolate blogConfig.theme values into className. To reskin, edit
  // the classes below directly (keep in sync with blogConfig.theme.accent).
  return (
    <div
  className="
    prose prose-xs dark:prose-invert max-w-none

    text-gray-400

    prose-headings:text-gray-400
    prose-headings:font-semibold
    prose-headings:tracking-tight

    prose-p:text-gray-300
    prose-strong:text-white

    prose-li:text-gray-300
    prose-ul:text-gray-300
    prose-ol:text-gray-300

    prose-blockquote:text-gray-300

    prose-code:text-cyan-300
    prose-pre:text-gray-200

    prose-a:text-cyan-400
    hover:prose-a:text-cyan-300
    prose-a:no-underline
    hover:prose-a:underline

    prose-img:rounded-lg

    prose-code:before:content-none
    prose-code:after:content-none
  "
>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: HeadingFactory("h2"),
          h3: HeadingFactory("h3"),
          code({ inline, className, children }) {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");

            if (inline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono">
                  {code}
                </code>
              );
            }

            return <CodeBlock language={match?.[1]} code={code} />;
          },
          a({ href, children }) {
            const isExternal = /^https?:\/\//.test(href || "");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
