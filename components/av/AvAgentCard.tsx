import type { Agent } from "@/lib/agents";
import styles from "./AgentsPage.module.css";

/**
 * In-development agent card — ported 1:1 from reference/avishkar-agents.html
 * `.agent` (the grid card with the striped "building" bar), populated from
 * real `lib/agents.ts` data. Reveal/hover/filter animation state is driven
 * by the parent `AvAgentLibrary`, which owns the IntersectionObserver and
 * passes the resulting classes in.
 */
export function AvAgentCard({
  agent,
  className,
  style,
}: {
  agent: Agent;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <article
      className={`${styles.agentCard} ${className ?? ""}`}
      data-cat={agent.category}
      style={style}
    >
      <div className={styles.agentTop}>
        <span>{agent.category} agent</span>
        <span>
          <i className={`${styles.dot} ${styles.dotDev}`} />
          In development
        </span>
      </div>
      <h3>{agent.name}</h3>
      <p>{agent.oneLiner}</p>
      <div className={styles.build} aria-hidden="true" />
    </article>
  );
}
