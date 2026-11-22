// Portfolio sections — shared by the landing page menu and the top navigation bar.
// A section with `to` is its own page; the others live on the landing page for now.
// A section with `locked` asks for a password before its page opens.
export const SECTIONS = [
  { id: 'projects', label: 'Projects' },
  { id: 'career', label: 'Career' },
  { id: 'trading', label: 'Trading' },
  { id: 'garage', label: 'Garage', to: '/garage' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'connect', label: 'Connect', to: '/connect' },
  { id: 'rishabh', label: 'RishAbh', to: '/rishabh', locked: true },
]
