const e = new Set(),
    t = new WeakMap(),
    n = new WeakMap(),
    o = new WeakMap(),
    i = new WeakMap(),
    r = new WeakMap(),
    a = new WeakMap(),
    s = new WeakMap(),
    l = new WeakSet()
let d,
    c = 0,
    u = 0
const f = '__aa_tgt',
    p = '__aa_del',
    h = '__aa_new',
    m = (e) => {
        const i = (function (e) {
            const t = e.reduce((e, t) => [...e, ...Array.from(t.addedNodes), ...Array.from(t.removedNodes)], [])
            return (
                !t.every((e) => '#comment' === e.nodeName) &&
                e.reduce((e, t) => {
                    if (!1 === e) return !1
                    if (t.target instanceof Element) {
                        if ((x(t.target), !e.has(t.target))) {
                            e.add(t.target)
                            for (let n = 0; n < t.target.children.length; n++) {
                                const o = t.target.children.item(n)
                                if (o) {
                                    if (p in o) return !1
                                    x(t.target, o), e.add(o)
                                }
                            }
                        }
                        if (t.removedNodes.length)
                            for (let o = 0; o < t.removedNodes.length; o++) {
                                const i = t.removedNodes[o]
                                if (p in i) return !1
                                i instanceof Element && (e.add(i), x(t.target, i), n.set(i, [t.previousSibling, t.nextSibling]))
                            }
                    }
                    return e
                }, new Set())
            )
        })(e)
        i &&
            i.forEach((e) =>
                (function (e) {
                    var i
                    const r = e.isConnected,
                        a = t.has(e)
                    r && n.has(e) && n.delete(e)
                    o.has(e) && (null === (i = o.get(e)) || void 0 === i || i.cancel())
                    h in e
                        ? $(e)
                        : a && r
                        ? (function (e) {
                              const n = t.get(e),
                                  i = W(e)
                              if (!O(e)) return t.set(e, i)
                              let r
                              if (!n) return
                              const a = L(e)
                              if ('function' != typeof a) {
                                  const t = n.left - i.left,
                                      o = n.top - i.top,
                                      [s, l, d, c] = T(e, n, i),
                                      u = {
                                          transform: `translate(${t}px, ${o}px)`,
                                      },
                                      f = {
                                          transform: 'translate(0, 0)',
                                      }
                                  s !== l && ((u.width = `${s}px`), (f.width = `${l}px`)),
                                      d !== c && ((u.height = `${d}px`), (f.height = `${c}px`)),
                                      (r = e.animate([u, f], {
                                          duration: a.duration,
                                          easing: a.easing,
                                      }))
                              } else {
                                  const [t] = C(a(e, 'remain', n, i))
                                  ;(r = new Animation(t)), r.play()
                              }
                              o.set(e, r), t.set(e, i), r.addEventListener('finish', w.bind(null, e))
                          })(e)
                        : a && !r
                        ? (function (e) {
                              var i
                              if (!n.has(e) || !t.has(e)) return
                              const [r, a] = n.get(e)
                              Object.defineProperty(e, p, {
                                  value: !0,
                                  configurable: !0,
                              })
                              const s = window.scrollX,
                                  l = window.scrollY
                              a && a.parentNode && a.parentNode instanceof Element
                                  ? a.parentNode.insertBefore(e, a)
                                  : r && r.parentNode
                                  ? r.parentNode.appendChild(e)
                                  : null === (i = N(e)) || void 0 === i || i.appendChild(e)
                              if (!O(e)) return j(e)
                              const [f, h, m, g] = (function (e) {
                                      const n = t.get(e),
                                          [o, , i] = T(e, n, W(e))
                                      let r = e.parentElement
                                      for (; r && ('static' === getComputedStyle(r).position || r instanceof HTMLBodyElement); )
                                          r = r.parentElement
                                      r || (r = document.body)
                                      const a = getComputedStyle(r),
                                          s = t.get(r) || W(r),
                                          l = Math.round(n.top - s.top) - M(a.borderTopWidth),
                                          d = Math.round(n.left - s.left) - M(a.borderLeftWidth)
                                      return [l, d, o, i]
                                  })(e),
                                  w = L(e),
                                  y = t.get(e)
                              ;(s === c && l === u) ||
                                  (function (e, t, n, o) {
                                      const i = c - t,
                                          r = u - n,
                                          a = document.documentElement.style.scrollBehavior
                                      'smooth' === getComputedStyle(d).scrollBehavior &&
                                          (document.documentElement.style.scrollBehavior = 'auto')
                                      if ((window.scrollTo(window.scrollX + i, window.scrollY + r), !e.parentElement)) return
                                      const s = e.parentElement
                                      let l = s.clientHeight,
                                          f = s.clientWidth
                                      const p = performance.now()
                                      function h() {
                                          requestAnimationFrame(() => {
                                              if (!k(o)) {
                                                  const e = l - s.clientHeight,
                                                      t = f - s.clientWidth
                                                  p + o.duration > performance.now()
                                                      ? (window.scrollTo({
                                                            left: window.scrollX - t,
                                                            top: window.scrollY - e,
                                                        }),
                                                        (l = s.clientHeight),
                                                        (f = s.clientWidth),
                                                        h())
                                                      : (document.documentElement.style.scrollBehavior = a)
                                              }
                                          })
                                      }
                                      h()
                                  })(e, s, l, w)
                              let v,
                                  b = {
                                      position: 'absolute',
                                      top: `${f}px`,
                                      left: `${h}px`,
                                      width: `${m}px`,
                                      height: `${g}px`,
                                      margin: '0',
                                      pointerEvents: 'none',
                                      transformOrigin: 'center',
                                      zIndex: '100',
                                  }
                              if (k(w)) {
                                  const [t, n] = C(w(e, 'remove', y))
                                  !1 !== (null == n ? void 0 : n.styleReset) &&
                                      ((b = (null == n ? void 0 : n.styleReset) || b), Object.assign(e.style, b)),
                                      (v = new Animation(t)),
                                      v.play()
                              } else
                                  Object.assign(e.style, b),
                                      (v = e.animate(
                                          [
                                              {
                                                  transform: 'scale(1)',
                                                  opacity: 1,
                                              },
                                              {
                                                  transform: 'scale(.98)',
                                                  opacity: 0,
                                              },
                                          ],
                                          {
                                              duration: w.duration,
                                              easing: 'ease-out',
                                          },
                                      ))
                              o.set(e, v), v.addEventListener('finish', j.bind(null, e, b))
                          })(e)
                        : $(e)
                })(e),
            )
    },
    g = (n) => {
        n.forEach((n) => {
            n.target === d &&
                (clearTimeout(s.get(d)),
                s.set(
                    d,
                    setTimeout(() => {
                        e.forEach((e) => S(e, (e) => v(() => w(e))))
                    }, 100),
                )),
                t.has(n.target) && w(n.target)
        })
    }
function w(e) {
    clearTimeout(s.get(e))
    const n = L(e),
        r = k(n) ? 500 : n.duration
    s.set(
        e,
        setTimeout(async () => {
            const n = o.get(e)
            try {
                await (null == n ? void 0 : n.finished),
                    t.set(e, W(e)),
                    (function (e) {
                        const n = i.get(e)
                        null == n || n.disconnect()
                        let o = t.get(e),
                            r = 0
                        o || ((o = W(e)), t.set(e, o))
                        const { offsetWidth: a, offsetHeight: s } = d,
                            l = [o.top - 5, a - (o.left + 5 + o.width), s - (o.top + 5 + o.height), o.left - 5]
                                .map((e) => -1 * Math.floor(e) + 'px')
                                .join(' '),
                            c = new IntersectionObserver(
                                () => {
                                    ++r > 1 && w(e)
                                },
                                {
                                    root: d,
                                    threshold: 1,
                                    rootMargin: l,
                                },
                            )
                        c.observe(e), i.set(e, c)
                    })(e)
            } catch {}
        }, r),
    )
}
function y(e) {
    setTimeout(() => {
        r.set(
            e,
            setInterval(() => v(w.bind(null, e)), 2e3),
        )
    }, Math.round(2e3 * Math.random()))
}
function v(e) {
    'function' == typeof requestIdleCallback ? requestIdleCallback(() => e()) : requestAnimationFrame(() => e())
}
let b, E
function x(e, t) {
    t || f in e
        ? t &&
          !(f in t) &&
          Object.defineProperty(t, f, {
              value: e,
          })
        : Object.defineProperty(e, f, {
              value: e,
          })
}
function M(e) {
    return Number(e.replace(/[^0-9.\-]/g, ''))
}
function W(e) {
    const t = e.getBoundingClientRect(),
        { x: n, y: o } = (function (e) {
            let t = e.parentElement
            for (; t; ) {
                if (t.scrollLeft || t.scrollTop)
                    return {
                        x: t.scrollLeft,
                        y: t.scrollTop,
                    }
                t = t.parentElement
            }
            return {
                x: 0,
                y: 0,
            }
        })(e)
    return {
        top: t.top + o,
        left: t.left + n,
        width: t.width,
        height: t.height,
    }
}
function T(e, t, n) {
    let o = t.width,
        i = t.height,
        r = n.width,
        a = n.height
    const s = getComputedStyle(e)
    if ('content-box' === s.getPropertyValue('box-sizing')) {
        const e = M(s.paddingTop) + M(s.paddingBottom) + M(s.borderTopWidth) + M(s.borderBottomWidth),
            t = M(s.paddingLeft) + M(s.paddingRight) + M(s.borderRightWidth) + M(s.borderLeftWidth)
        ;(o -= t), (r -= t), (i -= e), (a -= e)
    }
    return [o, r, i, a].map(Math.round)
}
function L(e) {
    return f in e && a.has(e[f])
        ? a.get(e[f])
        : {
              duration: 250,
              easing: 'ease-in-out',
          }
}
function N(e) {
    if (f in e) return e[f]
}
function O(e) {
    const t = N(e)
    return !!t && l.has(t)
}
function S(e, ...t) {
    t.forEach((t) => t(e, a.has(e)))
    for (let n = 0; n < e.children.length; n++) {
        const o = e.children.item(n)
        o && t.forEach((e) => e(o, a.has(o)))
    }
}
function C(e) {
    return Array.isArray(e) ? e : [e]
}
function k(e) {
    return 'function' == typeof e
}
function $(e) {
    h in e && delete e[h]
    const n = W(e)
    t.set(e, n)
    const i = L(e)
    if (!O(e)) return
    let r
    if ('function' != typeof i)
        r = e.animate(
            [
                {
                    transform: 'scale(.98)',
                    opacity: 0,
                },
                {
                    transform: 'scale(0.98)',
                    opacity: 0,
                    offset: 0.5,
                },
                {
                    transform: 'scale(1)',
                    opacity: 1,
                },
            ],
            {
                duration: 1.5 * i.duration,
                easing: 'ease-in',
            },
        )
    else {
        const [t] = C(i(e, 'add', n))
        ;(r = new Animation(t)), r.play()
    }
    o.set(e, r), r.addEventListener('finish', w.bind(null, e))
}
function j(e, r) {
    var a
    e.remove(),
        t.delete(e),
        n.delete(e),
        o.delete(e),
        null === (a = i.get(e)) || void 0 === a || a.disconnect(),
        setTimeout(() => {
            if (
                (p in e && delete e[p],
                Object.defineProperty(e, h, {
                    value: !0,
                    configurable: !0,
                }),
                r && e instanceof HTMLElement)
            )
                for (const t in r) e.style[t] = ''
        }, 0)
}
function A(t, n = {}) {
    if (b && E) {
        ;(window.matchMedia('(prefers-reduced-motion: reduce)').matches && !k(n) && !n.disrespectUserMotionPreference) ||
            (l.add(t),
            'static' === getComputedStyle(t).position &&
                Object.assign(t.style, {
                    position: 'relative',
                }),
            S(t, w, y, (e) => (null == E ? void 0 : E.observe(e))),
            k(n)
                ? a.set(t, n)
                : a.set(t, {
                      duration: 250,
                      easing: 'ease-in-out',
                      ...n,
                  }),
            b.observe(t, {
                childList: !0,
            }),
            e.add(t))
    }
    return Object.freeze({
        parent: t,
        enable: () => {
            l.add(t)
        },
        disable: () => {
            l.delete(t)
        },
        isEnabled: () => l.has(t),
    })
}
'undefined' != typeof window &&
    ((d = document.documentElement),
    (b = new MutationObserver(m)),
    (E = new ResizeObserver(g)),
    window.addEventListener('scroll', () => {
        ;(u = window.scrollY), (c = window.scrollX)
    }),
    E.observe(d))
const B = {
    mounted: (e, t) => {
        A(e, t.value || {})
    },
    getSSRProps: () => ({}),
}
export { A as default, T as getTransitionSizes, B as vAutoAnimate }
