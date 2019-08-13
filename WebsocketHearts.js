/**
 *  websokect 类
 *  1、连接（包括连接失败的重连接）
 *  2、错误处理（错误代码）
 *  3、消息发送
 *  4、消息接收
 *  5、连接成功的心跳检测（查看是否断线）
 */
export default class IWebSocket {
    /**
     * 类的构造函数
     * @param {必填} url 连接地址
     * @param {选填} pingTimeout  未收到消息多少秒之后发送ping请求，默认15000
     * @param {选填} pongTimeout 发送ping之后，未收到消息超时时间，默认10000毫秒
     * @param {选填} reconnectTimeout 连接超时的时间
     * @param {选填} pingMsg  默认检测心跳
     */
    constructor(url, pingTimeout=15000, pongTimeout=10000,reconnectTimeout=1000*10, repeatLimit=null) {
        this.url = url;
        this.pingTimeout = pingTimeout;
        this.pongTimeout = pongTimeout;
        this.reconnectTimeout = reconnectTimeout;
        this.pingMsg = "heartbeat";
        this.repeatLimit = repeatLimit;
        // websocket 实例
        this.ws = null;
        this.repeat = 0;
        this.createWebsocket();
        
        // 计算从开始到结束的心跳 
        this.pingTimeoutId = null;
        // 响应接受到发送的消息
        this.pongTimeoutId = null;
        // 重写websocket 属性方法
        this.onclose = () => {}
        this.onerror = () => {}
        this.onmessage = (event) => {}
        this.onopen = () => {}

        this.lockReconnet = false
    }
    close() {
        this.lockReconnet = true;
        this.heartReset();
        this.ws && this.ws.close();
    }
    send(data) {
        this.ws && this.ws.send(data);
    }

    // 创建websocket
    createWebsocket(){
        try {
            this.ws = new WebSocket(this.url);
            this.initEventHandle();
        } catch (error) {
            // 连接失败就重新连接
            this.reconnect();
            throw error;
      }
    }
    // 重写websocket的某些属性
    initEventHandle() {
        let _this = this;
        this.ws.onclose = () => {
            _this.onclose();
            _this.reconnect();
        };

        this.ws.onerror = () => {
            _this.onerror();
            _this.reconnect();
        }

        this.ws.onmessage = (event) => {
            _this.onmessage(event);
            // 能够正常接受到发送的心跳
            _this.heartCheck();
        }

        this.ws.onopen = () => {
            _this.onopen();
            _this.heartCheck();
        }
    }

    // 重新连接websocket
    reconnect() {
        if (this.lockReconnet) {
            return false;
        }
        this.lockReconnet = true;
        // 设置间隔多长时间才能重连，避免请求过多，造成崩溃
        setTimeout(() => {
            this.createWebsocket();
            this.lockReconnet = false;
        }, this.reconnectTimeout);
    }

    // 心跳检测
    heartCheck() {
        this.heartReset();
        this.heartStart();
    }

    // 心跳开始
    heartStart() {
        // 发送一条消息，查看是否能接受到
        this.pingTimeoutId = setTimeout(() => {
            this.send({content: "心跳检测"});
            this.pongTimeoutId = setTimeout(() => {
                this.ws.close();
            }, this.pongTimeout);
        }, this.pingTimeout);
    }

    // 重置心跳
    heartReset() {
        // 清空发送消息的定时器
        clearTimeout(this.pingTimeoutId);
        // 清空接受消息的定时器
        clearTimeout(this.pongTimeoutId);
    }
}
