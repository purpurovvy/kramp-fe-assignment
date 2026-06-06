type GraphQLError = {
  message: string;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? 'http://localhost:4000/graphql';

export const fetchGraphQL = async <T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status}`);
    }

    const json: GraphQLResponse<T> = await response.json();

    if (json.errors?.length) {
      throw new Error(json.errors[0].message);
    }

    if (!json.data) {
      throw new Error('Missing GraphQL data');
    }

    return json.data;
  } finally {
    clearTimeout(timeoutId);
  }
};
