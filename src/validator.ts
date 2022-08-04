import { Component, Watch, Vue } from 'vue-property-decorator'

import Schema, { Rules } from 'async-validator'
import { cloneDeep, debounce, find } from 'lodash'
import { deepObjectsDifference, convertNestedObjectToPath } from './utils'

export const DEBOUNCE_TIMEOUT = 1000

@Component
export default class Validator<T extends Record<string, unknown>> extends Vue {
  model: T
  private oldModel: T
  rules: Rules

  disableModelWatch = false

  private debouncedFn = debounce(() => this.debounce(), DEBOUNCE_TIMEOUT)

  error: {[key: string]: string} = {}

  created() {
    this.oldModel = cloneDeep(this.model)
  }

  formatErrorMsg() {
    let html = 'There are errors in the form:<br><ul>'
    for (const error of Object.values(this.error)) {
      html += '<li>' + error + '</li>'
    }
    html += '</ul>'
    this.$message({
      type: 'error',
      dangerouslyUseHTMLString: true,
      message: html,
      duration: Object.values(this.error).length * 500 + 3000,
      showClose: true,
    })
  }

  @Watch('model', { deep: true })
  updateErrorObj() {
    if (this.disableModelWatch) {
      return
    }
    this.debouncedFn()
  }

  private debounce() {
    const differenceObject = deepObjectsDifference(this.model, this.oldModel)
    const differingPropObject = convertNestedObjectToPath(differenceObject)
    for (const differingProp in differingPropObject) {
      this.validateForm(differingProp)
    }
    this.oldModel = cloneDeep(this.model)
  }

  async validateForm(prop = undefined) {
    const validator = new Schema(this.rules)
    try {
      await validator.validate(this.model, { suppressWarning: true }, (errors) => {
        if (errors) {
          if (prop == null) {
            this.error = errors.reduce((map, error) => {
              map[error.field] = error.message
              return map
            }, {})
          } else {
            this.error[prop] = find(errors, { field: prop })?.message
          }
        } else {
          this.error = {}
          return null
        }
      })
    } catch (e) {
      // Ignored
    }
    return prop ? this.error[prop] : this.error
  }

  protected async _submit() {
    try {
      await this.validateForm()
    } catch (e) {
      console.error(e)
    }
    if (Object.keys(this.error).length > 0) {
      this.$message.error({
        message: 'Unable to validate form, please check fields for errors',
      })
      return false
    }
    return true
  }

  getRelativeError(prefix: string) {
    const relativeError: any = {}
    let keys = Object.keys(this.error)
    keys = keys.map(e => {
      return e.startsWith(prefix) ? e : undefined
    }).filter((e) => e != null)
    for (const key of keys) {
      relativeError[key.replace(prefix + '.', '')] = this.error[key]
    }
    return relativeError
  }
}
