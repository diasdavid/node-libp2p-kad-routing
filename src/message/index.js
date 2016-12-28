'use strict'

const protobuf = require('protocol-buffers')
const pbm = protobuf(require('./dht.proto'))

const MESSAGE_TYPE = pbm.Message.MessageType
const CONNECTION_TYPE = pbm.Message.ConnectionType

/**
 * Represents a single DHT control message.
 */
class Message {
  /**
   * @param {MessageType} type
   * @param {string} key
   * @param {number} level
   */
  constructor (type, key, level) {
    this.type = type
    this.key = key
    this._clusterLevelRaw = level
  }

  get clusterLevel () {
    const level = this._clusterLevelRaw - 1
    if (level < 0) {
      return 0
    }

    return level
  }

  set clusterLevel (level) {
    this._clusterLevelRaw = level
  }

  /**
   * Encode into protobuf
   * @returns {Buffer}
   */
  static encode () {
    pbm.Message.encode({
      key: this.key,
      type: this.type,
      clusterLevelRaw: this._clusterLevelRaw
    })
  }

  /**
   * Decode from protobuf
   *
   * @param {Buffer} raw
   * @returns {Message}
   */
  static decode (raw) {
    const dec = pbm.Message.decode(raw)

    return new Message(dec.type, dec.key, dec.clusterLevelRaw)
  }
}

Message.TYPES = MESSAGE_TYPE

module.exports = Message