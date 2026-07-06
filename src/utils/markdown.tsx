import React from "react";

export const markdownComponents = {
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1
            className="text-2xl font-extrabold mb-2 mt-2 leading-tight w-full border-b border-white/20 pb-1"
            {...props}
        />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2
            className="text-xl font-bold mb-2 mt-2 leading-tight w-full"
            {...props}
        />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h3
            className="text-lg font-semibold mb-1 leading-tight w-full"
            {...props}
        />
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p className="text-base mb-2 w-full font-medium" {...props} />
    ),
    strong: (props: React.HTMLAttributes<HTMLElement>) => (
        <strong className="font-extrabold text-blue-200" {...props} />
    ),
    em: (props: React.HTMLAttributes<HTMLElement>) => (
        <em className="italic text-slate-200" {...props} />
    ),
    del: (props: React.HTMLAttributes<HTMLElement>) => (
        <del className="line-through text-slate-400" {...props} />
    ),
    a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a
            className="text-blue-300 hover:text-blue-100 underline decoration-blue-400/50 underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        />
    ),
    blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
        <blockquote
            className="border-l-4 border-blue-400 pl-3 my-2 italic bg-black/10 py-1 rounded-r w-full text-sm"
            {...props}
        />
    ),
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
        <ul
            className={`list-outside pl-5 mb-2 w-full ${className?.includes("contains-task-list") ? "list-none pl-1" : "list-disc"}`}
            {...props}
        />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
        <ol className="list-decimal list-outside pl-5 mb-2 w-full" {...props} />
    ),
    li: ({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
        <li
            className={`mb-1 ${className?.includes("task-list-item") ? "flex items-center gap-2" : ""}`}
            {...props}
        />
    ),
    input: (props: React.InputHTMLAttributes<HTMLInputElement>) => {
        if (props.type === "checkbox") {
            return (
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-blue-500 bg-black/30 border-white/40 focus:ring-blue-400 pointer-events-none"
                    disabled
                    {...props}
                />
            );
        }
        return <input {...props} />;
    },
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
        <pre
            className="inline-block bg-[#1e1e1e] rounded px-1.5 py-0.5 text-sm font-mono text-blue-300 border border-white/10 mx-0.5 align-middle"
            {...props}
        />
    ),
    code: ({
        inline,
        className,
        ...props
    }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
        if (inline) {
            return (
                <code
                    className="bg-black/30 rounded px-1.5 py-0.5 text-sm font-mono text-pink-300 border border-white/5"
                    {...props}
                />
            );
        }
        return (
            <code className={`text-blue-300 ${className || ""}`} {...props} />
        );
    },
    hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
        <hr className="w-full my-4 border-white/20" {...props} />
    ),
};
