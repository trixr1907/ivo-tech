import {createClient} from 'https://esm.sh/@sanity/client'
import imageUrlBuilder from 'https://esm.sh/@sanity/image-url'

export const client = createClient({
  projectId: '3qdm2zcq',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

// Helper to fetch intro text
export async function fetchIntro() {
  const query = `*[_type == "intro"][0]`
  const data = await client.fetch(query)
  return data
}

// Helper to fetch projects
export async function fetchProjects() {
  const query = `*[_type == "project"] | order(order asc)`
  const data = await client.fetch(query)
  return data
}
