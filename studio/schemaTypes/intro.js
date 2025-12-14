export const introType = {
  name: 'intro',
  title: 'Cinematic Intro',
  type: 'document',
  fields: [
    {
      name: 'scene1',
      title: 'Scene 1 Text (Jigsaw)',
      type: 'string',
      description: 'First text shown. Use <br> for line breaks.',
      initialValue: 'In the neon shadows<br>of a broken system…'
    },
    {
      name: 'scene2',
      title: 'Scene 2 Text (Fracture)',
      type: 'string',
      description: 'Second text shown.',
      initialValue: 'The system fractures.<br>The cracks grow wider.'
    },
    {
      name: 'scene3',
      title: 'Scene 3 Text (Hacker)',
      type: 'string',
      description: 'Third text shown.',
      initialValue: 'We are the ones who remember…<br>what most people forget.'
    },
    {
      name: 'scene4',
      title: 'Scene 4 Text (Climax)',
      type: 'string',
      description: 'Final text shown.',
      initialValue: 'Most people are so ungrateful<br>to be alive.'
    }
  ]
}
