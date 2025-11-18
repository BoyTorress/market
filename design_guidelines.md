# MarketExpress Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (Food Ordering + Japanese Aesthetic)

**Primary References:** Toast POS (admin UX), Uber Eats (customer ordering flow), with Japanese minimalist influences (clean lines, purposeful whitespace, refined typography)

**Design Principles:**
- Visual appetite appeal through high-quality food photography
- Intuitive ordering flow with minimal friction
- Clear hierarchy between customer and admin interfaces
- Warmth and approachability balanced with efficiency

---

## Typography

**Font Stack:**
- Primary: Inter (Google Fonts) - Clean, modern, excellent readability for UI
- Accent: Noto Sans JP (Google Fonts) - Japanese aesthetic touches for headers and brand elements

**Type Scale:**
- Hero Headlines: text-5xl to text-6xl, font-bold
- Section Headers: text-3xl to text-4xl, font-semibold
- Card Titles/Product Names: text-xl, font-semibold
- Body Text: text-base, font-normal
- UI Labels: text-sm, font-medium
- Metadata/Captions: text-xs to text-sm, font-normal

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 3, 4, 6, 8, 12, 16**
- Tight spacing: p-2, gap-2 (compact UI elements)
- Standard spacing: p-4, gap-4, m-6 (most components)
- Section spacing: py-12, py-16 (between major sections)
- Generous spacing: p-8, gap-8 (featured content)

**Grid Systems:**
- Menu Items: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Admin Dashboard: grid-cols-1 lg:grid-cols-4 (stats cards)
- Order Management: Two-column split (orders list + detail view)

**Container Widths:**
- Customer pages: max-w-7xl
- Admin panels: max-w-full with sidebar
- Content sections: max-w-6xl

---

## Component Library

### Customer-Facing Components

**Hero Section:**
- Full-width hero with high-quality ramen bowl image
- Overlaid heading with blurred backdrop (backdrop-blur-sm bg-black/30)
- Primary CTA button with blurred background
- Tagline beneath heading
- Height: min-h-[70vh]

**Menu Card:**
- Product image (aspect-ratio-square, rounded-lg)
- Product name (text-xl font-semibold)
- Description (text-sm text-gray-600, line-clamp-2)
- Price (text-lg font-bold)
- "Add to Cart" button
- Category badge (if applicable)
- Hover: subtle lift effect (hover:shadow-lg transition)

**Cart Sidebar:**
- Sliding panel from right
- Item list with thumbnail, name, quantity controls
- Running total with tax breakdown
- Checkout button (prominent, full-width)
- Empty state illustration

**Order Status Card:**
- Timeline visualization (vertical stepper)
- Order number prominently displayed
- Estimated ready time
- Current status badge
- Order details (items, total)

### Admin Components

**Dashboard Stats Cards:**
- 4-column grid on desktop
- Icon + metric + label
- Comparison indicator (trend arrows)
- Cards: Today's Sales, Active Orders, Low Stock Items, Total Orders

**Menu Management Table:**
- Product thumbnail column
- Editable fields (name, price, description)
- Stock quantity with inline edit
- Category dropdown
- Toggle availability switch
- Action buttons (edit, delete)

**Order Management Split View:**
- Left: Orders list with filters (All, Pending, Preparing, Ready)
- Right: Selected order detail with customer info, items, timeline
- Status update buttons
- Print receipt button

**Inventory Dashboard:**
- Ingredient cards with current stock levels
- Color-coded alerts (green: sufficient, yellow: low, red: critical)
- Quick restock input fields
- Last updated timestamp

**Reports Section:**
- Date range picker
- Chart visualization (sales over time)
- Export CSV button
- Summary metrics grid

---

## Navigation

**Customer Navigation:**
- Sticky header with logo (left), nav links (center), cart icon with badge (right)
- Links: Menu, My Orders, Contact
- Mobile: Hamburger menu

**Admin Navigation:**
- Sidebar layout (persistent on desktop, collapsible on mobile)
- Sections: Dashboard, Orders, Menu, Inventory, Reports, Settings
- Icon + label for each section
- Active state highlighting

---

## Forms

**Order Placement:**
- Customer name input
- Phone number input
- Pickup time selector (dropdown or time picker)
- Special instructions textarea
- Order type radio buttons (Pickup Now / Schedule)

**Admin Forms:**
- Inline editing for menu items
- Modal forms for adding new products
- Image upload with preview
- Form validation with clear error states

---

## Images

**Required Images:**
1. **Hero Image:** High-quality photo of signature ramen bowl (steaming, chopsticks, garnished) - full-width, 70vh height
2. **Menu Item Photos:** Individual dish photography for each menu item - square aspect ratio, consistent styling
3. **Empty State Illustrations:** Cart empty, no orders yet, no results found
4. **Category Icons:** Simple line icons for ramen types (tonkotsu, miso, shoyu, etc.)

**Image Treatment:**
- Rounded corners (rounded-lg) on all product images
- Subtle shadow on cards (shadow-md)
- Hover: slight scale (hover:scale-105)

---

## Interactions

**Micro-interactions (Minimal):**
- Cart badge pulse on item add
- Success checkmark animation on order placement
- Smooth transitions on tab/section changes (transition-all duration-300)

**No hover/active states needed for:** Buttons with blurred backgrounds (they have built-in states)

**Focus on:** Smooth, purposeful animations only where they enhance understanding (order status changes, cart updates)

---

## Accessibility

- Consistent form styling across all inputs
- Clear focus states (ring-2 ring-offset-2)
- Proper heading hierarchy (h1 > h2 > h3)
- Alt text for all food images
- ARIA labels for icon-only buttons

---

This design creates a polished, appetite-appealing experience for customers while providing administrators with efficient, professional tools for restaurant management.