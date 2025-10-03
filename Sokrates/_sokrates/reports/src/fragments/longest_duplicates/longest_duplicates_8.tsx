app/auth/[slug]/page.tsx [12:23]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const inputBase =
  "block w-full rounded-md border border-border bg-surface/60 px-3 py-2 text-sm text-text placeholder:text-text-muted/70 " +
  "focus:outline-ring focus:ring-2 focus:ring-[--color-ring] focus:border-transparent transition";

const labelBase = "mb-2 block text-sm font-medium text-text";
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/settings/SettingsForm.tsx [8:25]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import type { User } from "../types/User";
import Modal from "./modal";
import { ButtonMain } from "../Components/Button";

const inputBase =
  "block w-full rounded-md border border-border bg-surface/60 px-3 py-2 text-sm text-text placeholder:text-text-muted/70 " +
  "focus:outline-ring focus:ring-2 focus:ring-[--color-ring] focus:border-transparent transition";

const labelBase = "mb-2 block text-sm font-medium text-text";
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



