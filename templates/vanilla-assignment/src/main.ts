const templateInfo = {
  title: '__APP_TITLE__',
  slug: '__APP_SLUG__',
  description: '__APP_DESCRIPTION__',
  preset: '__PRESET__',
  kind: '__APP_KIND__',
  author: '__AUTHOR__',
  year: '__YEAR__',
};

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root element (#app) not found.');
}

app.innerHTML = `
  <section style="font-family: system-ui, sans-serif; margin: 2rem; line-height: 1.5;">
    <h1>${templateInfo.title}</h1>
    <p>${templateInfo.description}</p>
    <ul>
      <li><strong>Slug:</strong> ${templateInfo.slug}</li>
      <li><strong>Preset:</strong> ${templateInfo.preset}</li>
      <li><strong>Kind:</strong> ${templateInfo.kind}</li>
      <li><strong>Author:</strong> ${templateInfo.author}</li>
      <li><strong>Year:</strong> ${templateInfo.year}</li>
    </ul>
  </section>
`;
