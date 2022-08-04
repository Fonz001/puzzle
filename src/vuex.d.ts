// vuex.d.ts
import { Store } from 'vuex'
import { AppState } from './store/app'
import { PolicyConfigState } from './store/policy-config'

declare module '@vue/runtime-core' {
  // // declare your own store states
  interface State {
    app: AppState
    policyConfig: PolicyConfigState
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
