# Changelog

## 0.0.1 (2022-11-27)


### Features

* add `auth` middleware ([#2](https://github.com/eloqjs/nuxt-next-auth/issues/2)) ([88eeea2](https://github.com/eloqjs/nuxt-next-auth/commit/88eeea21914f0ce36d4112188e53325b0177638f))
* **composables:** improve `useSession` return type ([5dc28c6](https://github.com/eloqjs/nuxt-next-auth/commit/5dc28c62adbd96ce834df0c67690754feaa2bef5))
* implement broadcast channel ([#1](https://github.com/eloqjs/nuxt-next-auth/issues/1)) ([fdf5e27](https://github.com/eloqjs/nuxt-next-auth/commit/fdf5e27e75482b3fe38387261b3a458502bce2bd))


### Bug Fixes

* change signIn/signOut content type ([ecdc4c7](https://github.com/eloqjs/nuxt-next-auth/commit/ecdc4c7f9fd0b9dd1116d644aed12b25d2dc29f5))
* **composables:** `status` is computed ref ([17baac7](https://github.com/eloqjs/nuxt-next-auth/commit/17baac75c879b1ce445d483513e8d4b2a3766bed))
* **composables:** set `getSession` event on `signIn` ([3efcb18](https://github.com/eloqjs/nuxt-next-auth/commit/3efcb185fd198ad4a5298bf2adc0f580af9b3750))
* **handler:** fix req host ([945d38c](https://github.com/eloqjs/nuxt-next-auth/commit/945d38c732d7202b050a9c3d22a748318277a3c0))
* **handler:** should not override `secret` ([23661c7](https://github.com/eloqjs/nuxt-next-auth/commit/23661c7b7f601808e19bb382d1f52067f8bbb703))
* **module:** `_getSession` should not be auto-imported ([15e2ad8](https://github.com/eloqjs/nuxt-next-auth/commit/15e2ad8d59434798f493975194666ca41b2d6086))
* **plugin:** `_getSession` should be called always ([c59f347](https://github.com/eloqjs/nuxt-next-auth/commit/c59f3477e785589228babb46dd34c727bb40816a))
* replicate `session` event from server-side on client-side ([e7766a5](https://github.com/eloqjs/nuxt-next-auth/commit/e7766a553c0eb3f05652adf62ff21b71533253f3))
* **utils:** copy BroadcastChannel source code ([fdfc230](https://github.com/eloqjs/nuxt-next-auth/commit/fdfc2301c8bca49e62c31cad87b87d044637a69f))
* **utils:** fix import of `FetchOptions` type ([8107e1c](https://github.com/eloqjs/nuxt-next-auth/commit/8107e1c4f5f129639b1cb524c588dddca5bc3c55))


### Miscellaneous Chores

* release 0.0.1 ([4e32fc7](https://github.com/eloqjs/nuxt-next-auth/commit/4e32fc7c8fe8075fe31102220dd9eea41a0992f9))
