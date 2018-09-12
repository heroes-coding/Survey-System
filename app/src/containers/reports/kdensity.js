import * as d3 from "d3"
import React from 'react'
import Graph from './graph'

function kernelDensityEstimator(kernel, X) {
  // X here are the "bins" for the kDensity function
  return function(V) {
    // V here, the outer parameter, is the entire dataset
    return X.map(function(x) {
      // d3.mean here is a mean of a mapping of the elements of V, which are every point in the dataset.  For small amounts of data, javascript would probably be fine, but if you are talking many 100,000s of points of data, this will slow down to a crawl.  Need to rewrite it in C
      return [x, d3.mean(V, function(v) {
        return kernel(x - v)
      })]
    })
  }
}

function kernelEpanechnikov(k) {
  // k here is the first parameter passed in, kind of the smoothness of the kernel function
  return function(v) {
    // and v is the value of a given point
    v = Math.abs(v/k)
    return v <= 1 ? 0.75 * (1 - v * v) / k : 0
  }
}

export default (props) => {
  let { X, graphClass, xLabel, xRatio, yRatio, xOff, yOff, title, formatter, yFormatter } = props
  const xMin = d3.min(X)
  const xMax = d3.max(X)
  const xRange = xMax-xMin
  const xPad = xRange*0.05
  const xScale = d3.scaleLinear().range([40, 480]).domain([xMin-xPad,xMax+xPad])

  const xTicks = xScale.ticks(25).filter(x => x >= 0)
  let densityPoints = kernelDensityEstimator(kernelEpanechnikov(1), xTicks)(X)
  let endPoint = densityPoints[densityPoints.length-1]
  if (!endPoint) {
    return <div></div>
  }
  endPoint[1] = 0
  densityPoints = densityPoints.filter(([x,y]) => x >= 1 && x <= xMax )
  if (densityPoints.length > 2) {
    densityPoints = [[1,0], ...densityPoints, endPoint]
  }
  return (
    <Graph
      graphClass={graphClass}
      linePoints={densityPoints}
      yLabel='K Density'
      xLabel={xLabel}
      title={title}
      xRatio={xRatio}
      yRatio={yRatio}
      xOff={xOff}
      yOff={yOff}
      formatter={formatter}
      yFormatter={yFormatter}
    />
  )
}
