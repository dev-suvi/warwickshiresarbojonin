import fs from 'fs';
import path from 'path';

const GALLERY_ROOT = path.join(process.cwd(), 'public', 'gallery', 'events-new');

export function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/pujo/gi, 'puja')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'gallery';
}

function getYearFromFolderName(folderName = '') {
  const match = String(folderName).match(/(20\d{2})/);
  return match ? match[1] : null;
}

export function getGalleryIndexData() {
  if (!fs.existsSync(GALLERY_ROOT)) {
    return [];
  }

  const groupsByYear = new Map();

  fs.readdirSync(GALLERY_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .forEach((entry) => {
      const year = getYearFromFolderName(entry.name);
      if (!year) return;

      const yearGroups = groupsByYear.get(year) || [];
      const groupDir = path.join(GALLERY_ROOT, entry.name);
      const files = fs.readdirSync(groupDir)
        .filter((file) => /\.(png|jpe?g|gif|webp|avif)$/i.test(file))
        .map((file) => `/gallery/events-new/${entry.name}/${file}`);

      yearGroups.push({
        id: slugify(entry.name),
        title: entry.name.replace(/^\d+\s*[-.]\s*/i, '').trim() || entry.name,
        folderName: entry.name,
        coverImage: files[0] || '/gallery/image-1.png',
        imageCount: files.length,
        images: files,
      });

      groupsByYear.set(year, yearGroups.sort((a, b) => {
        const aNum = Number(String(a.folderName).match(/^\d+/)?.[0] || 0);
        const bNum = Number(String(b.folderName).match(/^\d+/)?.[0] || 0);
        return aNum - bNum;
      }));
    });

  return Array.from(groupsByYear.entries())
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, groups]) => ({
      year,
      title: year,
      description:
        year === '2025'
          ? 'Community celebrations and cultural memories from the 2025 season'
          : 'Recent programmes and celebrations from the current season',
      groups,
      totalImages: groups.reduce((sum, group) => sum + group.imageCount, 0),
    }));
}

export function getGalleryByYear(year) {
  return getGalleryIndexData().find((item) => item.year === year) || null;
}

export function getGalleryAlbum(year, albumSlug) {
  const yearData = getGalleryByYear(year);
  if (!yearData) return null;

  const normalize = (value = '') =>
    slugify(value)
      .replace(/^\d+-/, '')
      .replace(/puja/gi, 'puja');

  const exact = yearData.groups.find((group) => group.id === albumSlug);
  if (exact) return exact;

  return yearData.groups.find((group) => normalize(group.id) === normalize(albumSlug)) || null;
}
