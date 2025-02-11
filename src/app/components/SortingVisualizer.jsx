"use client"

import React, { useState, useEffect, useRef } from "react"
import {
	Activity,
	BarChart3,
	RefreshCw,
	Settings2,
	Sun,
	Moon,
	Maximize2,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const SortingVisualizer = () => {
	const [fullscreenAlgo, setFullscreenAlgo] = useState(null)
	const [arrays, setArrays] = useState([])
	const [selectedAlgos, setSelectedAlgos] = useState([])
	const [arraySize, setArraySize] = useState(50)
	const [isCompareMode, setIsCompareMode] = useState(false)
	const [isSorting, setIsSorting] = useState(false)
	const [speed, setSpeed] = useState(50)
	const [showSettings, setShowSettings] = useState(true)
	const [sortingTimes, setSortingTimes] = useState({})
	const [isDarkMode, setIsDarkMode] = useState(true)
	const [activeCategory, setActiveCategory] = useState("Basic")
	const [isExpanded, setIsExpanded] = useState(true) // New state for expansion
	const speedRef = useRef(speed)
	const sortingRef = useRef(false)

	// Update speedRef when speed changes
	useEffect(() => {
		speedRef.current = speed
	}, [speed])
	const algorithmCategories = {
		All: Object.values({
			Basic: ["bubblesort", "selectionsort", "insertionsort"],
			Efficient: ["quicksort", "mergesort", "heapsort"],
			Advanced: ["shellsort", "radixsort", "bitonicsort"],
			Experimental: [
				"gnomesort",
				"combsort",
				"pancakesort",
				"pigeonholesort",
				"stoogesort",
			],
		}).flat(),
		Basic: ["bubblesort", "selectionsort", "insertionsort"],
		Efficient: ["quicksort", "mergesort", "heapsort"],
		Advanced: ["shellsort", "radixsort", "bitonicsort"],
		Experimental: [
			"gnomesort",
			"combsort",
			"pancakesort",
			"pigeonholesort",
			"stoogesort",
		],
	}

	const algorithms = [
		{
			id: "bubblesort",
			name: "Bubble Sort",
			complexity: "O(n²)",
			color: "bg-red-500",
			sort: async (arr, setArray, index) => {
				const n = arr.length
				const delays = []
				for (let i = 0; i < n - 1; i++) {
					for (let j = 0; j < n - i - 1; j++) {
						if (!sortingRef.current) return // Check if sorting should stop
						if (arr[j] > arr[j + 1]) {
							const temp = arr[j]
							arr[j] = arr[j + 1]
							arr[j + 1] = temp
							delays.push([...arr])
						}
					}
				}

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return // Check if sorting should stop
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},
		{
			id: "heapsort",
			name: "Heap Sort",
			complexity: "O(n log n)",
			color: "bg-yellow-500",
			sort: async (arr, setArray, index) => {
				const delays = []

				const heapify = (arr, n, i) => {
					let largest = i
					let left = 2 * i + 1
					let right = 2 * i + 2

					if (left < n && arr[left] > arr[largest]) largest = left
					if (right < n && arr[right] > arr[largest]) largest = right

					if (largest !== i) {
						;[arr[i], arr[largest]] = [arr[largest], arr[i]]
						delays.push([...arr])
						heapify(arr, n, largest)
					}
				}

				const heapSort = async (arr) => {
					let n = arr.length

					for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i)
					for (let i = n - 1; i > 0; i--) {
						;[arr[0], arr[i]] = [arr[i], arr[0]]
						delays.push([...arr])
						heapify(arr, i, 0)
					}
				}

				await heapSort(arr)

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},
		{
			id: "shellsort",
			name: "Shell Sort",
			complexity: "O(n log n)",
			color: "bg-orange-500",
			sort: async (arr, setArray, index) => {
				const delays = []
				let n = arr.length

				for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
					for (let i = gap; i < n; i++) {
						let temp = arr[i]
						let j = i

						while (j >= gap && arr[j - gap] > temp) {
							arr[j] = arr[j - gap]
							j -= gap
							delays.push([...arr])
						}

						arr[j] = temp
						delays.push([...arr])
					}
				}

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},
		{
			id: "radixsort",
			name: "Radix Sort",
			complexity: "O(nk)",
			color: "bg-teal-500",
			sort: async (arr, setArray, index) => {
				const delays = []
				const getMax = (arr) => Math.max(...arr)
				const countingSort = (arr, exp) => {
					let output = new Array(arr.length).fill(0)
					let count = new Array(10).fill(0)

					for (let i = 0; i < arr.length; i++)
						count[Math.floor(arr[i] / exp) % 10]++
					for (let i = 1; i < 10; i++) count[i] += count[i - 1]

					for (let i = arr.length - 1; i >= 0; i--) {
						output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i]
						count[Math.floor(arr[i] / exp) % 10]--
					}

					for (let i = 0; i < arr.length; i++) arr[i] = output[i]
					delays.push([...arr])
				}

				let max = getMax(arr)
				for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10)
					countingSort(arr, exp)

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},
		{
			id: "gnomesort",
			name: "Gnome Sort",
			complexity: "O(n²)",
			color: "bg-cyan-500",
			sort: async (arr, setArray, index) => {
				const delays = []
				let pos = 0

				while (pos < arr.length) {
					if (pos === 0 || arr[pos] >= arr[pos - 1]) {
						pos++
					} else {
						;[arr[pos], arr[pos - 1]] = [arr[pos - 1], arr[pos]]
						pos--
						delays.push([...arr])
					}
				}

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},
		{
			id: "combsort",
			name: "Comb Sort",
			complexity: "O(n log n)",
			color: "bg-lime-500",
			sort: async (arr, setArray, index) => {
				const delays = []
				let n = arr.length
				let gap = n
				let swapped = true

				while (gap > 1 || swapped) {
					gap = Math.floor(gap / 1.3)
					if (gap < 1) gap = 1

					swapped = false
					for (let i = 0; i + gap < n; i++) {
						if (arr[i] > arr[i + gap]) {
							;[arr[i], arr[i + gap]] = [arr[i + gap], arr[i]]
							swapped = true
							delays.push([...arr])
						}
					}
				}

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},
		{
			id: "pancakesort",
			name: "Pancake Sort",
			complexity: "O(n²)",
			color: "bg-rose-500",
			sort: async (arr, setArray, index) => {
				const delays = []

				const flip = (arr, k) => {
					let i = 0
					while (i < k) {
						;[arr[i], arr[k]] = [arr[k], arr[i]]
						i++
						k--
					}
					delays.push([...arr])
				}

				for (let curr_size = arr.length; curr_size > 1; curr_size--) {
					let maxIdx = 0
					for (let i = 0; i < curr_size; i++) {
						if (arr[i] > arr[maxIdx]) maxIdx = i
					}
					if (maxIdx !== curr_size - 1) {
						flip(arr, maxIdx)
						flip(arr, curr_size - 1)
					}
				}

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},
		{
			id: "pigeonholesort",
			name: "Pigeonhole Sort",
			complexity: "O(n + k)",
			color: "bg-blue-700",
			sort: async (arr, setArray, index) => {
				const delays = []
				let min = Math.min(...arr)
				let max = Math.max(...arr)
				let range = max - min + 1
				let holes = new Array(range).fill(0)

				for (let num of arr) holes[num - min]++
				let i = 0
				for (let j = 0; j < range; j++) {
					while (holes[j]-- > 0) {
						arr[i++] = j + min
						delays.push([...arr])
					}
				}

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},
		{
			id: "bitonicsort",
			name: "Bitonic Sort",
			complexity: "O(log² n)",
			color: "bg-violet-500",
			sort: async (arr, setArray, index) => {
				const delays = []

				// Corrected Comparison Function
				const compAndSwap = (arr, i, j, dir) => {
					if (
						(dir === 1 && arr[i] > arr[j]) ||
						(dir === 0 && arr[i] < arr[j])
					) {
						;[arr[i], arr[j]] = [arr[j], arr[i]]
						delays.push([...arr]) // Capture the state after swap
					}
				}

				// Recursive Bitonic Merge
				const bitonicMerge = (arr, low, cnt, dir) => {
					if (cnt > 1) {
						let k = Math.floor(cnt / 2)
						for (let i = low; i < low + k; i++) compAndSwap(arr, i, i + k, dir)
						bitonicMerge(arr, low, k, dir)
						bitonicMerge(arr, low + k, k, dir)
					}
				}

				// Recursive Bitonic Sort
				const bitonicSort = (arr, low, cnt, dir) => {
					if (cnt > 1) {
						let k = Math.floor(cnt / 2)
						bitonicSort(arr, low, k, 1) // Sort first half ascending
						bitonicSort(arr, low + k, k, 0) // Sort second half descending
						bitonicMerge(arr, low, cnt, dir) // Merge entire sequence
					}
				}

				// Ensure array size is a power of 2 (Bitonic Sort works best this way)
				const n = arr.length
				const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(n)))
				const paddedArray = [...arr, ...Array(powerOfTwo - n).fill(Infinity)] // Pad with Infinity if needed

				// Perform Bitonic Sort
				bitonicSort(paddedArray, 0, paddedArray.length, 1)

				// Apply sorting steps with delay
				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i].slice(0, n) // Trim padded elements
						return newArrays
					})
				}
			},
		},
		{
			id: "stoogesort",
			name: "Stooge Sort",
			complexity: "O(n^(log 3 / log 1.5))",
			color: "bg-fuchsia-500",
			sort: async (arr, setArray, index) => {
				const delays = []

				const stoogeSort = (arr, l, h) => {
					if (arr[l] > arr[h]) {
						;[arr[l], arr[h]] = [arr[h], arr[l]]
						delays.push([...arr])
					}

					if (h - l + 1 > 2) {
						let t = Math.floor((h - l + 1) / 3)
						stoogeSort(arr, l, h - t)
						stoogeSort(arr, l + t, h)
						stoogeSort(arr, l, h - t)
					}
				}

				stoogeSort(arr, 0, arr.length - 1)

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},

		{
			id: "quicksort",
			name: "Quick Sort",
			complexity: "O(n log n)",
			color: "bg-blue-500",
			sort: async (arr, setArray, index) => {
				const delays = []

				const partition = (arr, low, high) => {
					const pivot = arr[high]
					let i = low - 1

					for (let j = low; j < high; j++) {
						if (arr[j] < pivot) {
							i++
							const temp = arr[i]
							arr[i] = arr[j]
							arr[j] = temp
							delays.push([...arr])
						}
					}

					const temp = arr[i + 1]
					arr[i + 1] = arr[high]
					arr[high] = temp
					delays.push([...arr])

					return i + 1
				}

				const quickSort = async (arr, low, high) => {
					if (low < high) {
						const pi = partition(arr, low, high)
						await quickSort(arr, low, pi - 1)
						await quickSort(arr, pi + 1, high)
					}
				}

				await quickSort(arr, 0, arr.length - 1)

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return // Check if sorting should stop
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},
		{
			id: "cocktailshaker",
			name: "Cocktail Shaker Sort",
			complexity: "O(n²)",
			color: "bg-purple-500",
			sort: async (arr, setArray, index) => {
				const delays = []
				let swapped = true
				let start = 0
				let end = arr.length - 1

				while (swapped) {
					swapped = false

					// Left to right
					for (let i = start; i < end; i++) {
						if (!sortingRef.current) return
						if (arr[i] > arr[i + 1]) {
							const temp = arr[i]
							arr[i] = arr[i + 1]
							arr[i + 1] = temp
							swapped = true
							delays.push([...arr])
						}
					}

					if (!swapped) break

					swapped = false
					end--

					// Right to left
					for (let i = end - 1; i >= start; i--) {
						if (!sortingRef.current) return
						if (arr[i] > arr[i + 1]) {
							const temp = arr[i]
							arr[i] = arr[i + 1]
							arr[i + 1] = temp
							swapped = true
							delays.push([...arr])
						}
					}

					start++
				}

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},
		{
			id: "mergesort",
			name: "Merge Sort",
			complexity: "O(n log n)",
			color: "bg-green-500",
			sort: async (arr, setArray, index) => {
				const delays = []

				const merge = async (arr, l, m, r) => {
					const n1 = m - l + 1
					const n2 = r - m

					const L = new Array(n1)
					const R = new Array(n2)

					for (let i = 0; i < n1; i++) L[i] = arr[l + i]
					for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j]

					let i = 0,
						j = 0,
						k = l

					while (i < n1 && j < n2) {
						if (L[i] <= R[j]) {
							arr[k] = L[i]
							i++
						} else {
							arr[k] = R[j]
							j++
						}
						k++
						delays.push([...arr])
					}

					while (i < n1) {
						arr[k] = L[i]
						i++
						k++
						delays.push([...arr])
					}

					while (j < n2) {
						arr[k] = R[j]
						j++
						k++
						delays.push([...arr])
					}
				}

				const mergeSort = async (arr, l, r) => {
					if (l < r) {
						const m = Math.floor((l + r) / 2)
						await mergeSort(arr, l, m)
						await mergeSort(arr, m + 1, r)
						await merge(arr, l, m, r)
					}
				}

				await mergeSort(arr, 0, arr.length - 1)

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},
		{
			id: "insertionsort",
			name: "Insertion Sort",
			complexity: "O(n²)",
			color: "bg-pink-500",
			sort: async (arr, setArray, index) => {
				const delays = []
				const n = arr.length

				for (let i = 1; i < n; i++) {
					const key = arr[i]
					let j = i - 1

					while (j >= 0 && arr[j] > key) {
						if (!sortingRef.current) return
						arr[j + 1] = arr[j]
						j--
						delays.push([...arr])
					}

					arr[j + 1] = key
					delays.push([...arr])
				}

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},
		{
			id: "selectionsort",
			name: "Selection Sort",
			complexity: "O(n²)",
			color: "bg-indigo-500",
			sort: async (arr, setArray, index) => {
				const delays = []
				const n = arr.length

				for (let i = 0; i < n - 1; i++) {
					let minIdx = i
					for (let j = i + 1; j < n; j++) {
						if (!sortingRef.current) return
						if (arr[j] < arr[minIdx]) {
							minIdx = j
						}
					}

					const temp = arr[minIdx]
					arr[minIdx] = arr[i]
					arr[i] = temp
					delays.push([...arr])
				}

				for (let i = 0; i < delays.length; i++) {
					if (!sortingRef.current) return
					await new Promise((resolve) =>
						setTimeout(resolve, 101 - speedRef.current)
					)
					setArray((prevArrays) => {
						const newArrays = [...prevArrays]
						newArrays[index] = delays[i]
						return newArrays
					})
				}
			},
		},
	]

	const generateRandomArray = (size) => {
		return Array.from(
			{ length: size },
			() => Math.floor(Math.random() * 100) + 1
		)
	}

	const resetArrays = () => {
		setSortingTimes({})
		if (isCompareMode) {
			setArrays(selectedAlgos.map(() => generateRandomArray(arraySize)))
		} else {
			setArrays([generateRandomArray(arraySize)])
		}
	}
	const handleTabClick = (category) => {
		if (category === activeCategory) {
			// If clicking the same category, toggle expansion
			setIsExpanded(!isExpanded)
		} else {
			// If clicking a different category, set it as active and ensure it's expanded
			setActiveCategory(category)
			setIsExpanded(true)
		}
	}

	const handleSort = async (algoIndex = null) => {
		if (isSorting) return

		setIsSorting(true)
		sortingRef.current = true
		setSortingTimes({})

		const startTime = performance.now()

		if (algoIndex !== null) {
			// Sort single algorithm
			const currentAlgo = algorithms.find(
				(algo) => algo.id === selectedAlgos[algoIndex]
			)
			if (currentAlgo) {
				await currentAlgo.sort([...arrays[algoIndex]], setArrays, algoIndex)
				const endTime = performance.now()
				setSortingTimes((prev) => ({
					...prev,
					[currentAlgo.id]: endTime - startTime,
				}))
			}
		} else {
			// Sort all algorithms in compare mode
			const promises = selectedAlgos.map(async (algoId, index) => {
				const algo = algorithms.find((a) => a.id === algoId)
				if (algo) {
					const algoStartTime = performance.now()
					await algo.sort([...arrays[index]], setArrays, index)
					const algoEndTime = performance.now()
					setSortingTimes((prev) => ({
						...prev,
						[algoId]: algoEndTime - algoStartTime,
					}))
				}
			})

			await Promise.all(promises)
		}

		sortingRef.current = false
		setIsSorting(false)
	}

	const handleAlgoSelect = (algoId, checked) => {
		if (!isCompareMode) {
			setSelectedAlgos([algoId])
			// Generate new array when selecting a different algorithm
			const newArray = generateRandomArray(arraySize)
			setArrays([newArray])
			setSortingTimes({}) // Reset sorting times
		} else {
			if (checked) {
				setSelectedAlgos([...selectedAlgos, algoId])
				// Generate new array for the added algorithm
				setArrays((prev) => [...prev, generateRandomArray(arraySize)])
			} else {
				setSelectedAlgos(selectedAlgos.filter((id) => id !== algoId))
				// Remove array for the deselected algorithm
				const index = selectedAlgos.indexOf(algoId)
				setArrays((prev) => prev.filter((_, i) => i !== index))
			}
			setSortingTimes({}) // Reset sorting times
		}
	}

	const stopSorting = () => {
		sortingRef.current = false
		setIsSorting(false)
	}

	useEffect(() => {
		// Only reset arrays when array size or compare mode changes
		// Algorithm selection is handled in handleAlgoSelect
		if (selectedAlgos.length > 0) {
			resetArrays()
		}
	}, [arraySize, isCompareMode]) // Remove selectedAlgos.length from dependencies
	return (
		<div
			className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50"} p-6`}>
			<Card
				className={`max-w-7xl mx-auto ${isDarkMode ? "bg-gray-900 border-gray-700" : ""}`}>
				<CardHeader
					className={`border-b ${isDarkMode ? "border-gray-600 text-white" : "border-gray-200 text-gray-900"}`}>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<BarChart3
								className={`h-6 w-6 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`}
							/>
							<CardTitle>Sorting Algorithm Visualizer</CardTitle>
						</div>
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsDarkMode(!isDarkMode)}
								className={
									isDarkMode
										? "bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
										: ""
								}>
								{isDarkMode ? (
									<Sun className="h-4 w-4" />
								) : (
									<Moon className="h-4 w-4" />
								)}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowSettings(!showSettings)}
								className={`transition-colors ${
									isDarkMode
										? "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
										: "bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
								}`}>
								<Settings2 className="h-4 w-4 mr-2" />
								{showSettings ? "Hide Settings" : "Show Settings"}
							</Button>
						</div>
					</div>
				</CardHeader>

				<CardContent className="p-6">
					<div className="mb-6">
						<Tabs value={activeCategory}>
							<TabsList className="mb-4">
								{Object.keys(algorithmCategories).map((category) => (
									<TabsTrigger
										key={category}
										value={category}
										onClick={() => handleTabClick(category)}>
										{category}
									</TabsTrigger>
								))}
							</TabsList>

							{Object.entries(algorithmCategories).map(
								([category, algoIds]) => (
									<TabsContent
										key={category}
										value={category}
										className={`transition-all duration-200 ${
											!isExpanded && category === activeCategory
												? "h-0 overflow-hidden"
												: ""
										}`}>
										{(isExpanded || category !== activeCategory) && (
											<div className="grid grid-cols-4 gap-4">
												{algorithms
													.filter((algo) => algoIds.includes(algo.id))
													.map((algo) => (
														<button
															key={algo.id}
															onClick={() =>
																handleAlgoSelect(
																	algo.id,
																	!selectedAlgos.includes(algo.id)
																)
															}
															className={`relative flex flex-col items-start p-3 rounded-lg border ${
																selectedAlgos.includes(algo.id)
																	? isDarkMode
																		? "border-blue-500 bg-blue-900/20"
																		: "border-blue-500 bg-blue-50"
																	: isDarkMode
																		? "border-gray-700 hover:border-gray-600"
																		: "border-gray-200 hover:border-gray-300"
															} transition-all group w-full`}>
															<div className="flex items-center gap-2 mb-2">
																<div
																	className={`w-2 h-2 rounded-full ${algo.color}`}
																/>
																<span
																	className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
																	{algo.name}
																</span>
															</div>
															<span
																className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
																{algo.complexity}
															</span>
															{selectedAlgos.includes(algo.id) && (
																<div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
															)}
														</button>
													))}
											</div>
										)}
									</TabsContent>
								)
							)}
						</Tabs>
					</div>

					<div className="flex gap-6">
						{showSettings && (
							<div className="w-80 shrink-0">
								<Card
									className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
									<CardContent className="p-4 space-y-6">
										{/* Settings Content */}
										<div className="flex items-center justify-between">
											<div className="space-y-1">
												<h4
													className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
													Compare Mode
												</h4>
												<p
													className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
													View multiple algorithms side by side
												</p>
											</div>
											<Switch
												checked={isCompareMode}
												onCheckedChange={setIsCompareMode}
											/>
										</div>

										{/* Array Size Slider */}
										<div>
											<div className="flex items-center justify-between mb-2">
												<h4
													className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
													Array Size
												</h4>
												<span
													className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
													{arraySize}
												</span>
											</div>
											<Slider
												value={[arraySize]}
												onValueChange={(value) => setArraySize(value[0])}
												min={10}
												max={200}
												step={10}
												className={`w-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
											/>
										</div>

										{/* Speed Slider */}
										<div>
											<div className="flex items-center justify-between mb-2">
												<h4
													className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
													Speed
												</h4>
												<span
													className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
													{speed}%
												</span>
											</div>
											<Slider
												value={[speed]}
												onValueChange={(value) => setSpeed(value[0])}
												min={1}
												max={100}
												className={`w-full ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}
											/>
										</div>

										{/* Control Buttons */}
										<div className="space-y-2">
											<Button
												className={`w-full ${isDarkMode ? "bg-gray-700 text-white border-gray-500 hover:bg-gray-600" : ""}`}
												variant="outline"
												onClick={resetArrays}
												disabled={isSorting}>
												<RefreshCw className="h-4 w-4 mr-2" />
												Generate New Array
											</Button>

											{isCompareMode && selectedAlgos.length > 0 && (
												<Button
													className="w-full"
													onClick={() => handleSort()}
													disabled={isSorting}>
													{isSorting ? "Sorting..." : "Sort All"}
												</Button>
											)}
											{isSorting && (
												<Button
													className="w-full"
													variant="destructive"
													onClick={stopSorting}>
													Stop Sorting
												</Button>
											)}
										</div>

										{/* Complexity Guide */}
										<div className="mt-4 space-y-2">
											<h4
												className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
												Time Complexity Guide
											</h4>
											<div className="grid grid-cols-2 gap-2">
												{[
													{ complexity: "O(n)", color: "bg-green-500" },
													{ complexity: "O(n log n)", color: "bg-blue-500" },
													{ complexity: "O(n²)", color: "bg-yellow-500" },
													{ complexity: "O(n³)", color: "bg-red-500" },
												].map(({ complexity, color }) => (
													<div
														key={complexity}
														className="flex items-center gap-2">
														<div className={`w-3 h-3 rounded-full ${color}`} />
														<span
															className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
															{complexity}
														</span>
													</div>
												))}
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						)}

						{/* Visualization Area */}
						<div className="flex-1 space-y-4">
							<div
								className={`grid gap-4 ${
									fullscreenAlgo !== null
										? "grid-cols-1"
										: selectedAlgos.length > 1
											? "grid-cols-2"
											: "grid-cols-1"
								}`}>
								{arrays.map((array, index) => {
									if (fullscreenAlgo !== null && fullscreenAlgo !== index)
										return null
									const algo = algorithms.find(
										(a) => a.id === selectedAlgos[index]
									)
									return (
										<Card
											key={index}
											className={`overflow-hidden ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}>
											<CardHeader
												className={`py-3 px-4 border-b ${isDarkMode ? "border-gray-700" : ""}`}>
												<div className="flex items-center justify-between">
													<CardTitle
														className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
														{algo ? algo.name : "Algorithm"}
													</CardTitle>

													<div className="flex items-center gap-2">
														{sortingTimes[algo?.id] && (
															<Badge
																variant="secondary"
																className={`text-xs ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`}>
																{sortingTimes[algo.id].toFixed(2)}ms
															</Badge>
														)}
														{algo && (
															<Badge variant="secondary" className="text-xs">
																{algo.complexity}
															</Badge>
														)}
														<Button
															size="sm"
															variant="ghost"
															onClick={() =>
																setFullscreenAlgo(
																	fullscreenAlgo === index ? null : index
																)
															}>
															<Maximize2 className="h-4 w-4" />
														</Button>
														{!isCompareMode && (
															<Button
																size="sm"
																onClick={() => handleSort(index)}
																disabled={isSorting}>
																{isSorting ? "Sorting..." : "Sort"}
															</Button>
														)}
													</div>
												</div>
											</CardHeader>
											<CardContent className="p-4">
												<div
													className={`${
														fullscreenAlgo === index
															? "h-[calc(100vh-16rem)]"
															: "h-64"
													} flex items-end rounded-lg ${
														isDarkMode
															? "bg-gray-800 border border-gray-600"
															: "bg-gray-50 border border-gray-200"
													}`}>
													{array.map((value, i) => (
														<div
															key={i}
															className={`w-1 mx-px transition-all duration-150 ${algo ? algo.color : "bg-blue-500"}`}
															style={{ height: `${value}%` }}
														/>
													))}
												</div>
											</CardContent>
										</Card>
									)
								})}
							</div>
							{selectedAlgos.length === 0 && (
								<Card
									className={`border-2 border-dashed ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}>
									<CardContent className="p-8">
										<div className="text-center space-y-2">
											<Activity
												className={`h-8 w-8 mx-auto ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}
											/>
											<h3
												className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
												No Algorithm Selected
											</h3>
											<p
												className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
												Select an algorithm from the tabs above to begin
												visualization
											</p>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

// Custom hook for managing the sorting state
const useSorting = (initialSpeed = 50) => {
	const [isSorting, setIsSorting] = useState(false)
	const [speed, setSpeed] = useState(initialSpeed)
	const speedRef = useRef(speed)
	const sortingRef = useRef(false)

	useEffect(() => {
		speedRef.current = speed
	}, [speed])

	const stopSorting = useCallback(() => {
		sortingRef.current = false
		setIsSorting(false)
	}, [])

	return {
		isSorting,
		setIsSorting,
		speed,
		setSpeed,
		speedRef,
		sortingRef,
		stopSorting,
	}
}

export default SortingVisualizer
