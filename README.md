# virtualabacus
 
[Deployed](http://virtual-abacus.herokuapp.com/) on heroku.

This is a personal project filling two purposes. One, as a way to learn JavaScript, front end dev, server-side dev, etc. Two, to build a tool to help keep my mental arithmetic ability sharp.

The app simulates a 4+1 row standard abacus, currently available with 4 columns (max number is 9999). 

<img width="233" alt="image" src="https://user-images.githubusercontent.com/58671823/199534912-a74d3844-7a41-4970-8b52-713eec14e2bb.png">

The beads are movable, up and down. The beads on the bottom section can collide and push the next bead in the same direction. On touch devices, up to two touches (for simultaneous movement of two beads) are supported. 

Based on the positioning of the beads, the "Result:" counter will display the numeric value currently represented by the abacus.

<img width="233" alt="image" src="https://user-images.githubusercontent.com/58671823/199536903-bac26f35-150c-4b4f-bd72-e6fec4ba617f.png">

It also has a practice mode which generates addition and multiplication practice questions.

<img width="232" alt="image" src="https://user-images.githubusercontent.com/58671823/199535341-c5c20e76-8568-4bfa-a99c-b04fee76e3a7.png">

The difficulty of practice questions can be adjusted (max difficulty is currently limited by the 4 column implementation). Addition questions will take the format of n1 + n2 + n3 etc, where the number of 'n's is controlled by the "length" slider. Whether n is a single digit, double digit, etc, number is controlled by the "digits" slider.

Multiplication questions will take the form of n1 * n2. Where both 'n's size is controlled by two different sliders.

<img width="232" alt="image" src="https://user-images.githubusercontent.com/58671823/199535474-e97854dc-3457-494b-8426-2b43dce44759.png">

Questions will be generated and displayed in the top half. They can be answered by manipulating the abacus to the answer and tapping "check ans".

<img width="231" alt="image" src="https://user-images.githubusercontent.com/58671823/199535756-88c23530-bf23-498c-89e3-80512c4e2a74.png">

The top section will provide feedback on whether the answer was correct or not and keep score. The next button will generate the next question.

<img width="231" alt="image" src="https://user-images.githubusercontent.com/58671823/199536005-60cb51c7-0d3b-4caa-be56-d6a4887d3f3f.png">

Future development will include ux improvements, addition with subtraction, division, and server-side score saving.
