# M3CoreCRM — UI Component Library & Theming Spec

> Frontend stack: **React 18 + Vite (CRM)**, **Next.js 14 (marketing)**, **Tailwind CSS (shared config)**, **Zustand**, **React Query**, **React Hook Form + Zod**, **Radix primitives where helpful**.  
> Goals: **modular, accessible, themeable, and reusable** components with per‑tenant branding, dark mode, RTL, and strong DX (Storybook).

---

## 1) Design Tokens & Theming

### 1.1 Tokens (CSS variables; consumed by Tailwind)
```css
:root {
  --color-bg: 255 255 255;
  --color-fg: 17 24 39;
  --brand-50: 240 249 255;
  --brand-500: 14 165 233;
  --brand-600: 2 132 199;
  --success-500: 34 197 94;
  --warning-500: 245 158 11;
  --danger-500: 239 68 68;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  --shadow-1: 0 1px 2px rgba(0 0 0 / 0.06);
  --shadow-2: 0 4px 12px rgba(0 0 0 / 0.08);

  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system;
}
:root.dark {
  --color-bg: 17 24 39;
  --color-fg: 243 244 246;
  --brand-50: 8 47 73;
  --brand-500: 56 189 248;
  --brand-600: 14 165 233;
}
/* Example tenant override */
[data-tenant-theme="acme"]{
  --brand-500: 168 85 247; /* violet */
  --brand-600: 147 51 234;
}
```

### 1.2 Tailwind config (shared)
```ts
// tailwind.config.ts (shared)
export default {
  darkMode: ["class"],
  content: ["./apps/**/*.{ts,tsx}", "./packages/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        fg: "rgb(var(--color-fg) / <alpha-value>)",
        brand: {
          50: "rgb(var(--brand-50) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
        },
        success: { 500: "rgb(var(--success-500) / <alpha-value>)" },
        warning: { 500: "rgb(var(--warning-500) / <alpha-value>)" },
        danger:  { 500: "rgb(var(--danger-500) / <alpha-value>)" }
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)"
      },
      boxShadow: {
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
      }
    }
  },
  plugins: []
}
```

### 1.3 Theme switching
- Per user: store preference in profile; apply `class="dark"` and `[data-tenant-theme]` on `<html>`.
- Per tenant branding: set `[data-tenant-theme]` at login.

### 1.4 RTL & i18n
- Use `dir="auto"` on text containers; toggle `dir="rtl"` for Arabic locales.
- Logical properties (`ps`, `pe`, `ms`, `me`) in utility classes where needed.
- Dates/numbers via `Intl` (locale from user profile).

---

## 2) Component Principles
- **Accessible by default** (keyboard, ARIA, color contrast).
- **Composable** (headless patterns + Tailwind).
- **Typed** (strict TS props).
- **Testable** (React Testing Library + Vitest).
- **Theming‑friendly** (no hard‑coded colors/sizes).

---

## 3) Core Components (by category)

### 3.1 Foundation
- **Button** (`variant: primary|secondary|ghost|danger`, `size: sm|md|lg`, `isLoading`, `leftIcon`, `rightIcon`)
- **Icon** (SVG sprite, consistent sizing)
- **Badge/Tag** (`color: brand|success|warning|danger|neutral`)
- **Avatar** (`src`, `fallback`, `size`)
- **Tooltip**, **Popover**, **DropdownMenu**

### 3.2 Forms (Hook Form + Zod)
- **Form** (provider wrapper)
- **Field** (label, description, error, required)
- **InputText**, **Textarea**, **Select**, **Combobox**
- **NumberInput** (minor units support)
- **PhoneInput** (E.164; country select)
- **EmailInput** (MX optional async check)
- **OTPInput** (6 digits; paste support)
- **Checkbox**, **RadioGroup**, **Switch**
- **DatePicker** (range support, timezone aware)
- **FileUpload** (images, PDFs; previews; DO Spaces)
- **FormActions** (Submit/Cancel with busy states)

### 3.3 Data Display
- **DataTable** (server‑side pagination, sorting, column visibility, row selection, CSV export)
- **KeyValue** (definition list)
- **Card**, **Accordion**, **Tabs**
- **EmptyState** (icon, title, hint, action)
- **Skeleton** (loading placeholders)

### 3.4 Feedback
- **Toast** (stacked, timeout, persistent for errors)
- **InlineAlert** (info/success/warn/error)
- **Modal/Dialog** (focus trap, close on ESC, sizes)

### 3.5 Navigation
- **AppShell** (sidebar, topbar, breadcrumbs)
- **NavItem** (badge counts, permission‑aware visibility)
- **Pagination** (cursor‑based, first/prev/next/last)
- **Stepper** (wizards)

### 3.6 Domain Components
- **LeadCard** (status chip, score, source)
- **ContactCard** (primary phone/email actions)
- **CompanyCard** (industry, people count)
- **DealKanban** (drag stages, WIP limits, stage actions)
- **DealSummary** (amount, probability, expected close)
- **ActivityItem** (type icon, due date, owner)
- **TaskBoard** (my tasks, filter by due date/status)
- **UnitCard** (area, type, price/m², status)
- **UnitComponentsList** (rooms/baths with dimensions)
- **MapOverlay** (image or tiles; layers; polygon select)
- **ApprovalBanner** (pending state with Approve/Reject)
- **RoleGuard** (wraps children; checks permission/feature)
- **FeatureFlag** (entitlement aware UI gates)

### 3.7 Dashboard Widgets
- **KPI Tile** (value, delta, trendline)
- **Chart** wrappers (line, bar, pie; recharts or chart.js)
- **TableWidget** (compact table with quick filters)
- **MapMini** (units availability)
- **MarkdownNote** (admin announcements)

---

## 4) Component API Examples

### 4.1 Button
```ts
type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;
```

### 4.2 DataTable
```ts
type Column<T> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  width?: number|string;
  align?: "start"|"center"|"end";
  visible?: boolean;
};
type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  total?: number;
  cursor?: string;
  onNext?: (cursor: string) => void;
  onPrev?: (cursor: string) => void;
  onSort?: (key: string, dir: "asc"|"desc") => void;
  selectable?: boolean;
  onSelect?: (ids: string[]) => void;
};
```

### 4.3 RoleGuard
```tsx
<RoleGuard require={["deals.edit"]}>
  <Button variant="primary">Edit Deal</Button>
</RoleGuard>
```

### 4.4 ApprovalBanner
```tsx
<ApprovalBanner
  domain="deal.stage.move"
  level={1}
  dueAt="2025-08-10T10:00:00Z"
  onApprove={() => approve()}
  onReject={(reason) => reject(reason)}
/>
```

---

## 5) Layouts & Shell

- **Responsive breakpoints**: mobile-first; sidebar collapses < 1024px.
- **AppShell** exposes slots: `sidebar`, `topbar`, `content`, `footer`.
- **Global filters** (date, pipeline, project) exposed via context for dashboard widgets.

---

## 6) Theming & Branding

- **Per-tenant branding**: logo, brand color, accent color stored in tenant settings; applied using `[data-tenant-theme]` dataset.
- **Dark mode**: `class="dark"` toggled; persisted per user.
- **Density**: optional compact mode (`data-density="compact"`).

---

## 7) Accessibility (A11y) Guidelines
- Ensure focus order and visible focus rings.
- Keyboard interactions on all interactive components (Enter/Space).
- ARIA attributes on dialogs, menus, tabs, tooltips.
- Color contrast ≥ 4.5:1 for text.
- Live regions for toasts and async updates.

---

## 8) Internationalization
- Keys managed in `/packages/i18n` with JSON resources per locale.
- Components accept `label`, `ariaLabel`, or use i18n hooks.
- **RTL** support validated for Arabic (Cairo).

---

## 9) Testing & Storybook
- **Storybook** configured in the monorepo with stories per component.
- Stories include **a11y** checks and RTL toggles.
- **Visual regression** via Chromatic or Loki (optional).
- **Unit tests**: React Testing Library with mocking for hooks and API.
- **E2E**: Playwright/Cypress for flows (login, CRUD, approvals).

---

## 10) File Structure
```
packages/ui/
  src/
    index.ts
    theme/
      tokens.css
      tailwind.css
    components/
      button/
        Button.tsx
        Button.stories.tsx
        Button.test.tsx
      datatable/
        DataTable.tsx
        DataTable.stories.tsx
      forms/
        Form.tsx
        Field.tsx
        InputText.tsx
        PhoneInput.tsx
        OTPInput.tsx
      ...
    hooks/
      useRoleGuard.ts
      useFeatureFlag.ts
    icons/
      index.ts
apps/crm-dashboard/
  src/
    app-shell/
    pages/
    widgets/
```

---

## 11) Reusable Patterns

- **Resource List Page**: `Filters` + `DataTable` + `BulkActions` + `Drawer` for create/edit.
- **CRUD Drawer Form**: headless form with RHF; optimistic updates via React Query.
- **Kanban (Deals)**: virtualized columns; DnD; inline stage update with approval check.
- **Map Overlay**: overlay component accepts tile/image, layers, and GeoJSON features; emits `onSelect(entityId)`.
- **Notification Center**: command‑palette search, mark‑all‑as‑read.

---

## 12) Performance
- Component lazy loading for routes and heavy widgets.
- Virtualized lists/tables for large datasets.
- React Query caching & background refetch strategies.

---

## 13) Security in UI
- Hide UI actions without permission; still enforce on API.
- CSRF not used with pure JWT Bearer; if cookies used, add CSRF token header.
- Mask PII in logs; avoid leaking full phone/email in toasts.

---

## 14) Open Questions
1. Adopt **Radix UI** primitives broadly or selectively?
2. Preferred chart lib: **Chart.js** vs **Recharts**?
3. Need **theme marketplace** per tenant later?

---

**End — UI Component Library & Theming Spec**
