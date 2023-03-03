import { ApolloServer, gql } from "apollo-server";
import { allCollections, allOwners } from "./database/db.js";

const typeDefs = gql`
  type Owner {
    id: ID!
    name: String!
    address: String!
    profileImage: String!
    coverImage: String!
  }
  type Nft {
    id: ID!
    collectionId: ID!
    ownerId: ID!
    name: String!
    image: String!
    owner: Owner!
    collectionName: String!
  }
  type Collection {
    id: ID!
    name: String!
    profileImage: String!
    coverImage: String!
    category: String!
    creator: Owner!
    itemNumber: Int!
    createdAt: String!
    description: String!
    totalVolume: Int!
    floorPrice: Int!
    items: [Nft!]!
  }

  type Query {
    allCollections: [Collection!]!
    artCollection(category: String!): [Collection!]!
    gamingCollection(category: String!): [Collection!]!
    pfpsCollection(category: String!): [Collection!]!
  }
  type Mutation {
    createNft(
      name: String!
      description: String!
      image: String!
      externalUrl: String
      userId: String!
    ): Nft!
  }
`;

const resolvers = {
  Query: {
    allCollections() {
      allCollections.sort((a, b) => a.totalVolume - b.totalVolume);
      return allCollections;
    },
    artCollection(_, { category }) {
      const artCollection = allCollections.filter(
        (collection) => collection.category === category
      );
      artCollection.sort((a, b) => a.totalVolume - b.totalVolume);
      return artCollection;
    },
    gamingCollection(_, { category }) {
      const gamingCollection = allCollections.filter(
        (collection) => collection.category === category
      );
      gamingCollection.sort((a, b) => a.totalVolume - b.totalVolume);
      return gamingCollection;
    },
    pfpsCollection(_, { category }) {
      const pfpsCollection = allCollections.filter(
        (collection) => collection.category === category
      );
      pfpsCollection.sort((a, b) => a.totalVolume - b.totalVolume);
      return pfpsCollection;
    },
  },

  Mutation: {
    createNft(_, { name, description, image, externalUrl, userId }) {
      const newNft = {
        id: allNfts.length + 1,
        name,
        description,
        image,
        externalUrl,
        userId,
      };
      allNfts.push(newNft);
      return newNft;
    },
  },

  Nft: {
    owner({ ownerId }) {
      return allOwners.find((owner) => owner.id === ownerId);
    },
    collectionName({ collectionId }) {
      return allCollections.find((collection) => collection.id === collectionId)
        .name;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});