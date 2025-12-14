export const projectType = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'tech',
      title: 'Tech Stack',
      type: 'string',
      description: 'e.g. THREE.JS // WEBGL'
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Online', value: 'ONLINE'},
          {title: 'In Progress', value: 'IN PROGRESS'},
          {title: 'Offline', value: 'OFFLINE'},
          {title: 'Concept', value: 'CONCEPT'},
        ]
      }
    },
    {
      name: 'link',
      title: 'Project Link',
      type: 'url',
    },
    {
      name: 'image',
      title: 'Preview Image',
      type: 'image',
      options: {
        hotspot: true,
      }
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0
    }
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [
        {field: 'order', direction: 'asc'}
      ]
    }
  ]
}
