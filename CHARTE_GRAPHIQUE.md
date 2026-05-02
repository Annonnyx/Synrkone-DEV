# Charte Graphique Synkrone

## Identité visuelle

### Philosophy
Synkrone est une plateforme de création de bots Discord premium. L'identité visuelle doit refléter :
- **Technologie de pointe** : IA, automatisation, performance
- **Accessibilité** : création simplifiée, no-code
- **Communauté** : Discord, connexion, partage

---

## Palette de couleurs

### Couleurs primaires

| Token | Valeur | Usage |
|-------|--------|-------|
| `--background` | `#050507` | Fond principal (presque noir) |
| `--foreground` | `#f0f0f5` | Texte principal (blanc cassé) |
| `--primary` | `#7c5bf5` | Violet électrique - actions principales |
| `--primary-hover` | `#9b7ff7` | Violet clair - hover |
| `--primary-glow` | `rgba(124, 91, 245, 0.3)` | Glow violet |

### Couleurs d'accent

| Token | Valeur | Usage |
|-------|--------|-------|
| `--accent` | `#00e5ff` | Cyan néon - highlights, badges |
| `--accent-hover` | `#40ecff` | Cyan clair - hover |
| `--accent-glow` | `rgba(0, 229, 255, 0.2)` | Glow cyan |
| `--premium` | `#ffb800` | Or - fonctionnalités premium |
| `--premium-glow` | `rgba(255, 184, 0, 0.2)` | Glow or |

### Couleurs fonctionnelles

| Token | Valeur | Usage |
|-------|--------|-------|
| `--success` | `#00dc82` | Vert - succès, actif |
| `--warning` | `#ffb800` | Orange - avertissements |
| `--danger` | `#ff3d71` | Rose/rouge - erreurs, danger |

### Couleurs de surface (Glassmorphism)

| Token | Valeur | Usage |
|-------|--------|-------|
| `--glass` | `rgba(255, 255, 255, 0.04)` | Fond glass |
| `--glass-hover` | `rgba(255, 255, 255, 0.08)` | Fond glass hover |
| `--glass-border` | `rgba(255, 255, 255, 0.08)` | Bordures glass |
| `--card` | `rgba(255, 255, 255, 0.03)` | Fond cards |
| `--muted` | `#6b6b80` | Texte secondaire |

---

## Typographie

### Police principale
- **Famille** : Geist Sans (system-ui fallback)
- **Style** : Sans-serif moderne, géométrique

### Hiérarchie

| Élément | Taille | Poids | Letter-spacing | Line-height |
|---------|--------|-------|----------------|-------------|
| Hero H1 | 72-96px | 800 | -0.04em | 1.0 |
| H2 Section | 48-64px | 700 | -0.02em | 1.1 |
| H3 Card | 20-24px | 600 | -0.01em | 1.3 |
| Body | 14-16px | 400 | 0 | 1.6 |
| Caption | 12px | 500 | 0.02em | 1.4 |
| Button | 14px | 600 | 0 | 1 |

### Règles typographiques
- Titres : tracking-tight (lettres rapprochées)
- Texte courant : line-height relaxé (1.6)
- Gradients uniquement sur titres principaux
- Majuscules avec letter-spacing pour les labels

---

## Composants

### Boutons

#### Primary (btn-shiny)
- Background : gradient 135deg primary → primary-hover
- Border-radius : 12px (rounded-xl)
- Padding : 12px 24px
- Animation : shine sweep au hover
- Shadow : glow-primary au hover

#### Secondary (glass)
- Background : var(--glass)
- Border : 1px solid var(--glass-border)
- Border-radius : 12px
- Hover : background var(--glass-hover), border plus visible

#### Ghost
- Background : transparent
- Border : 1px solid var(--glass-border)
- Hover : background white/5

### Cards (bento-item)
- Border-radius : 24px (rounded-3xl)
- Background : var(--glass)
- Border : 1px solid var(--glass-border)
- Backdrop-filter : blur(20px)
- Hover : translateY(-2px), shadow profond, border plus clair
- Transition : 0.4s cubic-bezier(0.4, 0, 0.2, 1)

### Inputs
- Background : white/3 (très subtil)
- Border : 1px solid var(--glass-border)
- Border-radius : 12px
- Focus : border-primary/50, ring primary/30

---

## Effets & Animations

### Animations globales

| Animation | Durée | Timing | Description |
|-----------|-------|--------|-------------|
| float | 8s | ease-in-out infinite | Orbes flottantes |
| gradientShift | 6s | ease infinite | Dégradés animés |
| pulse-glow | 3s | ease-in-out infinite | Pulse subtil |
| slide-up | 0.6s | ease-out | Apparition éléments |

### Transitions
- Hover cards : 0.4s cubic-bezier(0.4, 0, 0.2, 1)
- Hover buttons : 0.3s ease
- Focus inputs : 0.15s ease

### Effets spéciaux
- **Glassmorphism** : backdrop-blur(20px) sur toutes les surfaces
- **Noise texture** : overlay SVG fractalNoise à 2.5% opacity
- **Mesh gradient** : 3 radials dégradés (violet, cyan, or)
- **Glow effects** : box-shadows colorés avec blur

---

## Layout

### Spacing
- Section padding : 80-120px vertical
- Card padding : 24-32px
- Grid gap : 16-24px
- Component gap : 12-16px

### Grid system
- Max-width container : 1280px (max-w-7xl)
- Bento grid : mix de 2-col et 1-col
- Responsive : mobile-first, breakpoints sm/md/lg/xl

### Border radius scale
- xs : 8px (inputs, badges)
- sm : 12px (buttons, small cards)
- md : 16px (moyennes surfaces)
- lg : 24px (bento-item, cards principales)
- full : 9999px (pills, badges ronds)

---

## Icônes

- **Bibliothèque** : Lucide React
- **Taille standard** : 20px (h-5 w-5)
- **Taille large** : 24px (h-6 w-6)
- **Couleur** : hérite du texte ou couleur thématique

---

## Usage des couleurs par contexte

### Landing page
- Hero : mesh-gradient background + orbes flottantes
- Features : bento-grid avec cartes glass
- CTA : gradient line + glow effects

### Dashboard
- Sidebar/Navbar : glass avec border-glass-border
- Cards : bento-item
- Stats : bg-white/3 avec borders subtils

### Pricing
- Popular card : glow-primary + scale accentué
- Premium cards : border-premium/30
- Free cards : standard glass

---

## Principes de design

1. **Profondeur** : layers avec glassmorphism, ombres douces
2. **Luminosité** : accents néon sur fond sombre
3. **Mouvement** : animations subtiles, pas aggressives
4. **Cohérence** : même langage visuel sur toutes les pages
5. **Accessibilité** : contraste suffisant (WCAG AA minimum)
