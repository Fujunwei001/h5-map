const CurvedArrowOverlay = (start, end, curveOffset) => {
        this.start = start
        this.end = end
        this.curveOffset = curveOffset || 80 // 控制弯曲程度
        this.lengthProgress = 0
      }

      CurvedArrowOverlay.prototype = new BMap.Overlay()

      CurvedArrowOverlay.prototype.initialize = function (map) {
        this._map = map
        var canvas = (this._canvas = document.createElement('canvas'))
        canvas.style.position = 'absolute'
        canvas.width = map.getSize().width
        canvas.height = map.getSize().height
        map.getPanes().markerPane.appendChild(canvas)
        return canvas
      }

      CurvedArrowOverlay.prototype.draw = function () {
        var map = this._map
        var ctx = this._canvas.getContext('2d')
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)

        var sp = map.pointToPixel(this.start)
        var ep = map.pointToPixel(this.end)

        // 控制点 = 起终点中点 + 垂直偏移
        var mx = (sp.x + ep.x) / 2
        var my = (sp.y + ep.y) / 2
        var dx = ep.x - sp.x
        var dy = ep.y - sp.y
        var len = Math.sqrt(dx * dx + dy * dy)
        var nx = -dy / len // 法向量
        var ny = dx / len
        var cp = { x: mx + nx * this.curveOffset, y: my + ny * this.curveOffset }

        ctx.lineWidth = 10
        ctx.strokeStyle = 'rgba(255,0,0,0.8)'
        ctx.fillStyle = 'rgba(255,0,0,0.8)'

        // 采样当前进度的曲线
        var points = []
        var totalSteps = 200
        var steps = Math.floor(totalSteps * this.lengthProgress)
        for (var t = 0; t <= steps; t++) {
          var tt = t / totalSteps
          var x = (1 - tt) * (1 - tt) * sp.x + 2 * (1 - tt) * tt * cp.x + tt * tt * ep.x
          var y = (1 - tt) * (1 - tt) * sp.y + 2 * (1 - tt) * tt * cp.y + tt * tt * ep.y
          points.push({ x: x, y: y })
        }

        // 画箭身
        ctx.beginPath()
        for (var i = 0; i < points.length; i++) {
          if (i === 0) ctx.moveTo(points[i].x, points[i].y)
          else ctx.lineTo(points[i].x, points[i].y)
        }
        ctx.stroke()

        // 箭头
        if (points.length > 1) {
          var p1 = points[points.length - 2]
          var p2 = points[points.length - 1]
          var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x)
          var headLen = 50
          ctx.beginPath()
          ctx.moveTo(p2.x, p2.y)
          ctx.lineTo(p2.x - headLen * Math.cos(angle - Math.PI / 6), p2.y - headLen * Math.sin(angle - Math.PI / 6))
          ctx.moveTo(p2.x, p2.y)
          ctx.lineTo(p2.x - headLen * Math.cos(angle + Math.PI / 6), p2.y - headLen * Math.sin(angle + Math.PI / 6))
          ctx.stroke()
        }
      }
