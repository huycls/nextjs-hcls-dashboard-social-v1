import {
  CheckCircle2,
  MessageSquare,
  Play,
  Plus,
  Send,
  Settings2,
  Sparkles,
  Split,
  Webhook,
  Zap,
} from "lucide-react";
import type { NodeIconType } from "@/lib/automations/workflow-templates";

const ICON_CLASS = "h-4 w-4";

export function WorkflowCanvasIcon({ icon }: { icon: NodeIconType }) {
  switch (icon) {
    case "start":
      return <Play className={ICON_CLASS} strokeWidth={2} fill="currentColor" />;
    case "trigger":
      return <Webhook className={ICON_CLASS} strokeWidth={1.75} />;
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
    case "add":
      return <Plus className={ICON_CLASS} strokeWidth={2} />;
    default:
      return <Zap className={ICON_CLASS} strokeWidth={1.75} />;
  }
}
