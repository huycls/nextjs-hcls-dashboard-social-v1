import {
  CheckCircle2,
  MessageSquare,
  Plus,
  Send,
  Settings2,
  Sparkles,
  Split,
  Zap,
} from "lucide-react";
import type { NodeIconType } from "@/lib/automations/workflow-templates";

const ICON_CLASS = "h-[18px] w-[18px]";

export function WorkflowCanvasIcon({ icon }: { icon: NodeIconType }) {
  switch (icon) {
    case "trigger":
      return <Plus className={ICON_CLASS} strokeWidth={1.75} />;
    case "process":
      return <Sparkles className={ICON_CLASS} strokeWidth={1.75} />;
    case "ai":
      return <Settings2 className={ICON_CLASS} strokeWidth={1.75} />;
    case "integration":
      return <Split className={ICON_CLASS} strokeWidth={1.75} />;
    case "output":
      return <Send className={ICON_CLASS} strokeWidth={1.75} />;
    case "complete":
      return <CheckCircle2 className={ICON_CLASS} strokeWidth={1.75} />;
    case "review":
      return <MessageSquare className={ICON_CLASS} strokeWidth={1.75} />;
    default:
      return <Zap className={ICON_CLASS} strokeWidth={1.75} />;
  }
}
