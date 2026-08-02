import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function PrevNextNav({ previous, next }) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Post navigation"
      className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-14 pt-10 border-t border-cyan-500/15"
    >
      {previous ? (
        <Link
          to={`/blogs/${previous.slug}`}
          className="group flex flex-col p-5 rounded-md
            border-b-2 border-cyan-400/50
            bg-slate-900/50 backdrop-blur-md
            transition-all duration-300
            hover:border-cyan-400
            hover:-translate-y-1"
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </span>
          <span className="text-base font-semibold text-white transition-colors line-clamp-1">
            {previous.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          to={`/blogs/${next.slug}`}
          className="group flex flex-col p-5 rounded-md
            border-b-2 border-cyan-400/50
            bg-slate-900/50 backdrop-blur-md
            transition-all duration-300
            hover:border-cyan-400
            hover:-translate-y-1"
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">
            Next
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
          <span className="text-base font-semibold text-white transition-colors line-clamp-1">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
