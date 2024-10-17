# IM3_publibike
This data visualization project displays the distribution of e-bikes and regular bikes across various Publibike stations in Bern, organized in a south-north axis by elevation levels. It tracks how the bikes are spread across the city over time, showing whether e-bikes tend to accumulate at higher elevations and regular bikes at lower ones. The analysis also proposes solutions, such as dynamic pricing, to encourage better distribution of bikes. By offering discounts for certain routes, Publibike could save on logistics and improve user experience.


# Learnings
- how to connect to different endpoints of different APIs: Publibike API and elevation API
- getting altitude of each single station in elevation API
- working with arrays and JSON files, en- and decoding from it
- loading to and unloading from our database
- separating the steps into different PHP files
- implementing libraries like chart.js, datepicker
- data visualisation in end product can differ from prototype as with real data you may find out new things
  - we changed to sort by longitude instead of altitude, labeled the chart in a new way
    
- CSS is a pain (but not impossible ;))


# Challenges
- Handling Arrays and JSONs between files was not successfull first
- Filters of chart (visibility of ebikes/velos) had to be defined explicitly to not get dropped after changing time or date values:
  - When fetching new data and updating the chart, initially the datasets (Velos and E-bikes) kept resetting their visibility state (toggling back on when they should have stayed off). It required learning how to store and reuse the hidden state of the datasets.
- Set default date and time in 15min intervall when page is loaded needed more effort than expected
- responsiveness of chart.js is difficult to understand: we could not get it to grow back when window gets big again after shrinking (not a usual usecase)
- In general: libraries are efficient but often not as flexible as own solutions. Sometimes we had to code for a long time to receive the desired results in our chart


# Tools Used 
- ChatGPT 4o
- Stack OverFlow
- MMP 101
- Dozenten Coachings


# Attachements

Chart Area and Height Profile (along yellow line)

![image](https://github.com/user-attachments/assets/5d992ad9-b8e4-4876-b9da-7168c19a2738)


<img width="428" alt="image" src="https://github.com/user-attachments/assets/f4c91d45-54db-43e0-b331-6b9d40154180">
