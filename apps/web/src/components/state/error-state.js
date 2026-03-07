import { jsx as _jsx } from "react/jsx-runtime";
import { Alert } from '@/components/ui/alert';
export function ErrorState({ message }) {
    return _jsx(Alert, { children: message });
}
