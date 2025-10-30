# Portfolio Photography Bento Grid Layout

## Overview
The Portfolio page now features a dynamic layout system that automatically displays photography in a Pinterest-style bento grid, while other categories use the traditional feature row layout.

## Features

### 1. **Automatic Layout Detection**
The system automatically detects photography categories by checking if the category name includes:
- "photo"
- "photography"

**Example category names that trigger bento grid:**
- "Photography"
- "Photo Gallery"
- "Street Photography"
- "Portrait Photos"

### 2. **Bento Grid Layout**

#### Grid Structure:
```
- Mobile: 2 columns
- Tablet: 3 columns  
- Desktop: 4 columns
```

#### Variable Item Sizes:
The grid uses a repeating pattern for visual interest:
1. **Tall** - Takes 2 rows
2. **Wide** - Takes 2 columns
3. **Regular** - Standard 1x1
4. **Tall** - Takes 2 rows
5. **Regular** - Standard 1x1
6. **Large** - Takes 2 columns × 2 rows
7. **Regular** - Standard 1x1
8. **Tall** - Takes 2 rows
9. **Regular** - Standard 1x1
10. **Wide** - Takes 2 columns

*Pattern repeats every 10 items*

#### Responsive Heights:
- Mobile: 150px rows
- Desktop: 200px rows

### 3. **Interactive Features**

#### Hover Effect:
- Image scales up slightly (110%)
- Dark gradient overlay appears
- Title and description fade in
- Border color changes to primary

#### Click to View:
- Opens full-screen lightbox modal
- Displays full-size image
- Shows title and description below
- Click outside or "Close" button to exit
- Smooth fade animations

### 4. **Component Structure**

#### BentoGrid Component
Located at: `src/components/BentoGrid.jsx`

**Props:**
- `items` (array) - Portfolio items with `imageUrl`, `title`, and `description`

**Features:**
- Staggered animation on load
- Responsive grid layout
- Modal lightbox for full view
- Optimized for touch devices

### 5. **Usage in Portfolio**

The Portfolio component automatically chooses the layout:

```jsx
// Photography categories → Bento Grid
if (activeTab.toLowerCase().includes('photo')) {
  return <BentoGrid items={activeArtworks} />
}

// Other categories → Feature Rows  
else {
  return activeArtworks.map((art, index) => (
    <FeatureRow key={index} item={art} index={index} />
  ))
}
```

## Mobile Optimization

### Touch-Friendly:
- Larger tap targets
- Smooth animations
- Optimized image loading
- Responsive text sizes

### Grid Adjustments:
- 2 columns on mobile
- Smaller gap spacing (3 vs 4)
- Reduced row height (150px vs 200px)
- Smaller text in overlays

## Styling

### Color Scheme:
- Border: `border-white/10`
- Hover border: `border-primary/50`
- Overlay: Gradient from black/80 to transparent
- Text: White on dark overlay

### Animations:
- Grid items fade in with stagger
- Hover scale: 1.02
- Image zoom: 110%
- Modal fade in/out
- Smooth transitions (300-500ms)

## Data Structure

Portfolio items should have:
```javascript
{
  title: "Photo Title",
  description: "Optional description", // Can be omitted
  imageUrl: "https://firebase-storage-url.com/image.jpg",
  featured: false // Optional
}
```

## Admin Setup

1. Go to Admin Dashboard → Portfolio
2. Create or select a category with "Photography" or "Photo" in the name
3. Add items with:
   - Title
   - Description (optional but recommended)
   - Image (upload via Firebase Storage)
4. Save Portfolio

## Browser Compatibility

✅ Chrome/Edge - Full support  
✅ Firefox - Full support  
✅ Safari - Full support  
✅ Mobile Safari - Full support  
✅ Chrome Mobile - Full support

## Performance

- Images lazy load by default
- CSS Grid for optimal performance
- Hardware-accelerated animations
- Optimized for mobile networks

## Accessibility

- Keyboard navigation for lightbox
- Alt text for all images
- Focus states on interactive elements
- Semantic HTML structure

## Future Enhancements

Possible improvements:
- [ ] Infinite scroll for large galleries
- [ ] Image filters/categories within photography
- [ ] Download option for images
- [ ] Share functionality
- [ ] EXIF data display (camera settings, location, etc.)
- [ ] Gallery slideshow mode
- [ ] Zoom on image in lightbox
