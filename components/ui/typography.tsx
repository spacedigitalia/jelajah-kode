import React from 'react';

export function TypographyH1({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <h1 className={`scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance ${className}`}>
            {children}
        </h1>
    )
}

export function TypographyH2({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <h2 className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}>
            {children}
        </h2>
    )
}

export function TypographyH3({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}>
            {children}
        </h3>
    )
}

export function TypographyH4({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <h4 className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}>
            {children}
        </h4>
    )
}

export function TypographyP({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <p className={`leading-7 not-first:mt-6 ${className}`}>
            {children}
        </p>
    )
}

export function TypographyBlockquote({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <blockquote className={`mt-6 border-l-2 pl-6 italic ${className}`}>
            {children}
        </blockquote>
    )
}

export function TypographyTable() {
    return (
        <div className="my-6 w-full overflow-y-auto">
            <table className="w-full">
                <thead>
                    <tr className="even:bg-muted m-0 border-t p-0">
                        <th className="border px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right">
                        </th>
                        <th className="border px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right">
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="even:bg-muted m-0 border-t p-0">
                        <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
                        </td>
                        <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
                        </td>
                    </tr>
                    <tr className="even:bg-muted m-0 border-t p-0">
                        <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
                        </td>
                        <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
                        </td>
                    </tr>
                    <tr className="even:bg-muted m-0 border-t p-0">
                        <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
                        </td>
                        <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export function TypographyList({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <ul className={`my-6 ml-6 list-disc [&>li]:mt-2 ${className}`}>
            {children}
        </ul>
    )
}

export function TypographyInlineCode({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <code className={`bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ${className}`}>
            {children}
        </code>
    )
}

export function TypographyLead({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <p className={`text-muted-foreground text-xl ${className}`}>
            {children}
        </p>
    )
}

export function TypographyLarge({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return <div className={`text-lg font-semibold ${className}`}>{children}</div>
}

export function TypographySmall({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <small className={`text-sm leading-none font-medium ${className}`}>
            {children}
        </small>
    )
}

export function TypographyMuted({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <p className={`text-muted-foreground text-sm ${className}`}>
            {children}
        </p>
    )
}

// Component untuk render HTML content dengan styling typography
export function TypographyContent({
    html,
    className = ""
}: {
    html: string;
    className?: string;
}) {
    return (
        <div
            className={`[&_h1]:scroll-m-20 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:mb-4
                [&_h2]:scroll-m-20 [&_h2]:border-b [&_h2]:pb-2 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2]:mb-4
                [&_h3]:scroll-m-20 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:mt-6 [&_h3]:mb-3
                [&_h4]:scroll-m-20 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:tracking-tight [&_h4]:mt-4 [&_h4]:mb-2
                [&_p]:leading-7 [&_p]:mb-4 [&_p:not(:first-child)]:mt-6
                [&_ul]:my-6 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2
                [&_ol]:my-6 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2
                [&_li]:mt-2 [&_li]:leading-7
                [&_strong]:font-semibold
                [&_em]:italic
                [&_a]:text-primary [&_a]:underline [&_a:hover]:text-primary/80
                [&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-6 [&_blockquote]:italic
                [&_code]:bg-muted [&_code]:relative [&_code]:rounded [&_code]:px-[0.3rem] [&_code]:py-[0.2rem] [&_code]:font-mono [&_code]:text-sm [&_code]:font-semibold
                [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4
                [&_pre_code]:bg-transparent [&_pre_code]:p-0
                [&_hr]:my-8 [&_hr]:border-t
                [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse
                [&_th]:border [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-bold
                [&_td]:border [&_td]:px-4 [&_td]:py-2
                [&_img]:rounded-lg [&_img]:my-4
                ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}
