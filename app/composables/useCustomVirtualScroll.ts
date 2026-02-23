export function useCustomVirtualScroll(options: {
  items: ComputedRef<any[]>;
  itemsPerRow: number;
  rowHeight: number;
  overscan?: number;
}) {
  const { items, itemsPerRow, rowHeight, overscan = 2 } = options;

  const scrollContainer = ref<HTMLElement | null>(null);
  const scrollTop = ref(0);
  const containerHeight = ref(0);

  // Calculate total rows
  const totalRows = computed(() => {
    return Math.ceil(items.value.length / itemsPerRow);
  });

  // Calculate total height
  const totalHeight = computed(() => {
    return totalRows.value * rowHeight;
  });

  // Calculate visible row range based on scroll position
  const visibleRange = computed(() => {
    const start = Math.floor(scrollTop.value / rowHeight);
    const visibleRowCount = Math.ceil(containerHeight.value / rowHeight);
    const end = start + visibleRowCount;

    // Add overscan to reduce flickering
    const startWithOverscan = Math.max(0, start - overscan);
    const endWithOverscan = Math.min(totalRows.value, end + overscan);

    return {
      start: startWithOverscan,
      end: endWithOverscan,
    };
  });

  // Get visible rows
  const visibleRows = computed(() => {
    const rows = [];
    for (let i = visibleRange.value.start; i < visibleRange.value.end; i++) {
      rows.push({
        index: i,
        top: i * rowHeight,
      });
    }
    return rows;
  });

  // Get items for a specific row
  function getRowItems(rowIndex: number) {
    const startIndex = rowIndex * itemsPerRow;
    const endIndex = Math.min(startIndex + itemsPerRow, items.value.length);
    return items.value.slice(startIndex, endIndex);
  }

  // Handle scroll event
  function handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    scrollTop.value = target.scrollTop;
  }

  // Update container height on mount and resize
  function updateContainerHeight() {
    if (scrollContainer.value) {
      containerHeight.value = scrollContainer.value.clientHeight;
    }
  }

  onMounted(() => {
    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateContainerHeight);
  });

  return {
    scrollContainer,
    totalHeight,
    visibleRows,
    getRowItems,
    handleScroll,
  };
}
