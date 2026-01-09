import { readFileSync } from 'fs';

const query = `
  query GetCompany($id: UUID!) {
    company(filter: { id: { eq: $id } }) {
      id
      name
      ats
      lastAtsRun
    }
  }
`;

const apiKey = readFileSync('.env', 'utf8').match(/TWENTY_API_KEY=(.+)/)[1];

fetch('https://api.twenty.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + apiKey
  },
  body: JSON.stringify({
    query: query,
    variables: { id: '5f035216-89b8-46b9-8c3c-021186ba89da' }
  })
})
.then(r => r.json())
.then(d => console.log(JSON.stringify(d, null, 2)))
.catch(e => console.error('Error:', e.message));
