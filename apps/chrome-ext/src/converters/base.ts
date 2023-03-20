export abstract class BaseConverter {
  get isActive() {
    return false
  }

  get currentFileName() {
    return ''
  }

  abstract convert(): string
}
