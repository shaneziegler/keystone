import {
  type BaseListTypeInfo,
  fieldType,
  type FieldTypeFunc,
  type CommonFieldConfig,
} from '@keystone-6/core/types'
import { graphql } from '@keystone-6/core'

type PairFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo>

type PairInput = {
  left: string | null | undefined
  right: string | null | undefined
}
type PairOutput = PairInput

const PairInput = graphql.inputObject({
  name: 'PairNestedInput',
  fields: {
    left: graphql.arg({ type: graphql.String }),
    right: graphql.arg({ type: graphql.String }),
  },
})

const PairOutput = graphql.object<PairOutput>()({
  name: 'PairNestedOutput',
  fields: {
    left: graphql.field({ type: graphql.String }),
    right: graphql.field({ type: graphql.String }),
  },
})

const PairFilter = graphql.inputObject({
  name: 'PairNestedFilter',
  fields: {
    equals: graphql.arg({
      type: PairInput,
    }),
  },
})

export function pair<ListTypeInfo extends BaseListTypeInfo> (
  config: PairFieldConfig<ListTypeInfo> = {}
): FieldTypeFunc<ListTypeInfo> {
  function resolveInput (value: PairInput | null | undefined) {
    if (!value) return { left: value, right: value }
    const { left = null, right = null } = value ?? {}
    return { left, right }
  }

  function resolveOutput (value: PairOutput) {
    return value
  }

  function resolveWhere (value: null | { equals: PairInput | null | undefined }) {
    if (value === null) {
      throw new Error('PairFilter cannot be null')
    }
    if (value.equals === undefined) {
      return {}
    }
    const { left, right } = resolveInput(value.equals)
    return {
      left: { equals: left },
      right: { equals: right },
    }
  }

  return meta =>
    fieldType({
      kind: 'multi',
      fields: {
        left: {
          kind: 'scalar',
          mode: 'optional',
          scalar: 'String',
        },
        right: {
          kind: 'scalar',
          mode: 'optional',
          scalar: 'String',
        },
      },
    })({
      ...config,
      input: {
        where: {
          arg: graphql.arg({ type: PairFilter }),
          resolve (value, context) {
            return resolveWhere(value)
          },
        },
        create: {
          arg: graphql.arg({ type: PairInput }),
          resolve (value, context) {
            return resolveInput(value)
          },
        },
        update: {
          arg: graphql.arg({ type: PairInput }),
          resolve (value, context) {
            return resolveInput(value)
          },
        },
      },
      output: graphql.field({
        type: PairOutput,
        resolve ({ value, item }, args, context, info) {
          return resolveOutput(value)
        },
      }),
      views: './3-pair-field-nested/views',
      getAdminMeta () {
        return {}
      },
    })
}
