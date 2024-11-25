import React from "react";
import WordCloud from "react-d3-cloud";

const WordCloudComponent = ({ wordCloudData }) => {
  const fontSizeMapper = (word) => Math.log2(word.value) * 10;
  const rotate = () => (Math.random() > 0.5 ? 0 : 90);

  return (
    <div>
      <WordCloud
        data={wordCloudData}
        fontSizeMapper={fontSizeMapper}
        rotate={rotate}
      />
    </div>
  );
};

export default WordCloudComponent;
