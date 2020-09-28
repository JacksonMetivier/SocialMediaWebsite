import React from 'react'
import InfiniteLoading from 'react-simple-infinite-loading'

function ScrollTest({ items, fetchMore, hasMore }) {
  const ref = React.useRef()
  const scrollToTop = () => {
    if (ref.current) {
      ref.current.scrollTo(0)
    }
  }
  const scrollTo50 = () => {
    if (ref.current) {
      ref.current.scrollToItem(50)
    }
  }
  const resetCache = () => {
    if (ref.current) {
      ref.current.resetloadMoreItemsCache()
    }
  }

  return (
    <>
      <button onClick={scrollToTop}>Scroll to top</button>
      <button onClick={scrollTo50}>Scroll to 50</button>
      <button onClick={resetCache}>Reset cache</button>
      <div style={{ width: 300, height: 300 }}>
        <InfiniteLoading
          hasMoreItems={hasMore}
          itemHeight={40}
          loadMoreItems={fetchMore}
          ref={ref}
        >
          {items.map(item => <div key={item}>{item}</div>)}
        </InfiniteLoading>
      </div>
    </>
  )
}

export default ScrollTest