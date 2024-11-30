/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n      query GetFundingFee($pool: String, $dateLte: BigInt, $dateGte: BigInt) {\n        dailyLpFeess(\n          where: { pool: $pool, date_lte: $dateLte, date_gte: $dateGte }\n        ) {\n          items {\n            feePerToken\n            feePercent\n            date\n            id\n            lpQty\n            newLiq\n            pool\n            liq\n          }\n        }\n      }\n    ": types.GetFundingFeeDocument,
    "\n      query MyQuery($pool: String) {\n        poolStateCurrents(where: { id: $pool }) {\n          items {\n            alpha\n            beta\n            id\n            k\n            longTokenAddress\n            longTokenPrice\n            longTokenSupply\n            lpTokenSupply\n            phi\n            oraclePrice\n            psi\n            reserve\n            shortTokenAddress\n            shortTokenPrice\n            shortTokenSupply\n            x\n          }\n        }\n      }\n    ": types.MyQueryDocument,
    "\n      query GetRawDailyData($pool: String, $dateGte: BigInt, $dateLte: BigInt) {\n        dailyInfos(\n          where: { pool: $pool, date_lte: $dateLte, date_gte: $dateGte }\n          orderBy: \"date\"\n          orderDirection: \"asc\"\n        ) {\n          items {\n            fee\n            lastLongPrice\n            date\n            lastShortPrice\n            lastTvl\n            maxTvl\n            minTvl\n            pool\n            volume\n            id\n          }\n        }\n      }\n    ": types.GetRawDailyDataDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query GetFundingFee($pool: String, $dateLte: BigInt, $dateGte: BigInt) {\n        dailyLpFeess(\n          where: { pool: $pool, date_lte: $dateLte, date_gte: $dateGte }\n        ) {\n          items {\n            feePerToken\n            feePercent\n            date\n            id\n            lpQty\n            newLiq\n            pool\n            liq\n          }\n        }\n      }\n    "): (typeof documents)["\n      query GetFundingFee($pool: String, $dateLte: BigInt, $dateGte: BigInt) {\n        dailyLpFeess(\n          where: { pool: $pool, date_lte: $dateLte, date_gte: $dateGte }\n        ) {\n          items {\n            feePerToken\n            feePercent\n            date\n            id\n            lpQty\n            newLiq\n            pool\n            liq\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query MyQuery($pool: String) {\n        poolStateCurrents(where: { id: $pool }) {\n          items {\n            alpha\n            beta\n            id\n            k\n            longTokenAddress\n            longTokenPrice\n            longTokenSupply\n            lpTokenSupply\n            phi\n            oraclePrice\n            psi\n            reserve\n            shortTokenAddress\n            shortTokenPrice\n            shortTokenSupply\n            x\n          }\n        }\n      }\n    "): (typeof documents)["\n      query MyQuery($pool: String) {\n        poolStateCurrents(where: { id: $pool }) {\n          items {\n            alpha\n            beta\n            id\n            k\n            longTokenAddress\n            longTokenPrice\n            longTokenSupply\n            lpTokenSupply\n            phi\n            oraclePrice\n            psi\n            reserve\n            shortTokenAddress\n            shortTokenPrice\n            shortTokenSupply\n            x\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query GetRawDailyData($pool: String, $dateGte: BigInt, $dateLte: BigInt) {\n        dailyInfos(\n          where: { pool: $pool, date_lte: $dateLte, date_gte: $dateGte }\n          orderBy: \"date\"\n          orderDirection: \"asc\"\n        ) {\n          items {\n            fee\n            lastLongPrice\n            date\n            lastShortPrice\n            lastTvl\n            maxTvl\n            minTvl\n            pool\n            volume\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      query GetRawDailyData($pool: String, $dateGte: BigInt, $dateLte: BigInt) {\n        dailyInfos(\n          where: { pool: $pool, date_lte: $dateLte, date_gte: $dateGte }\n          orderBy: \"date\"\n          orderDirection: \"asc\"\n        ) {\n          items {\n            fee\n            lastLongPrice\n            date\n            lastShortPrice\n            lastTvl\n            maxTvl\n            minTvl\n            pool\n            volume\n            id\n          }\n        }\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;