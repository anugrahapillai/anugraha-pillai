export default async function PreviewPage({ params }) { const { contentType, id } = await params; return <main><h1>Preview: {contentType}/{id}</h1></main>; }

