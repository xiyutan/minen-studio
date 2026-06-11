'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageContentProps {
  content: string;
}

export function MessageContent({ content }: MessageContentProps) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match && !className;

          if (isInline) {
            return (
              <code
                className="rounded bg-muted px-1.5 py-0.5 text-sm"
                {...props}
              >
                {children}
              </code>
            );
          }

          return (
            <div className="relative">
              {match && (
                <div className="absolute right-2 top-2 text-xs text-muted-foreground">
                  {match[1]}
                </div>
              )}
              <pre className="overflow-x-auto rounded-lg bg-muted p-4">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          );
        },
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
        ul({ children }) {
          return <ul className="mb-2 list-inside list-disc">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="mb-2 list-inside list-decimal">{children}</ol>;
        },
        li({ children }) {
          return <li className="mb-1">{children}</li>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          );
        },
        table({ children }) {
          return (
            <div className="my-2 overflow-x-auto">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="border border-border bg-muted px-3 py-2 text-left font-medium">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border border-border px-3 py-2">{children}</td>
          );
        },
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              {children}
            </a>
          );
        },
        h1({ children }) {
          return <h1 className="mb-2 text-xl font-bold">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="mb-2 text-lg font-bold">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="mb-2 text-base font-bold">{children}</h3>;
        },
        hr() {
          return <hr className="my-4 border-border" />;
        },
      }}
    >
      {content}
    </Markdown>
  );
}
