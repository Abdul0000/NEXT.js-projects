// import {
//     defaultShouldDehydrateQuery,
//     QueryClient,
//   } from '@tanstack/react-query';
// import superjson from 'superjson';
// //   import superjson from 'superjson';
//   export function makeQueryClient() {
//     return new QueryClient({
//       defaultOptions: {
//         queries: {
//           staleTime: 30 * 1000,
//         },
//         dehydrate: {
//           serializeData: superjson.serialize,
//           shouldDehydrateQuery: (query) =>
//             defaultShouldDehydrateQuery(query) ||
//             query.state.status === 'pending',
//         },
//         hydrate: {
//           deserializeData: superjson.deserialize,
//         },
//       },
//     });
//   }


import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import SuperJSON from 'superjson';
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
}