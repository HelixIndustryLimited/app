import React from 'react';
import styled from 'styled-components';

const Container = styled.span`
  display: inline-block;
  line-height: initial;
  width: 200px;
`;

const SliderInput = styled.input.attrs({type: 'range'})<any>`
  width: 100%;
  height: 10px; /* 设置input本身的高度，确保轨道可见 */
  -webkit-appearance: none; /* 移除默认的Webkit样式 */
  background: transparent; /* 使input本身的背景透明，让轨道伪元素可见 */
  overflow: hidden;
  position: relative; /* 如果SliderInput内部有定位元素，此行可能需要 */
  overflow: hidden; /* <-- 添加这一行是关键！ */
  border-radius: 5px; /* <-- 最好在input本身也加上，确保裁剪边界是圆角 */
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 10px; /* 轨道高度 */
    background: #151412; /* 未填充部分的背景颜色，例如深灰色 */
    border-radius: 5px; /* 轨道圆角 */
    /* Webkit浏览器中，已填充部分的颜色需要通过 thumb 的 box-shadow 来“模拟” */
  }
  &::-webkit-slider-thumb {
    -webkit-appearance: none; /* 移除默认样式 */
    height: 10px; /* 拇指高度 */
    width: 10px; /* 拇指宽度 */
   border-radius: 50%; /* 圆形拇指 */
    background: var(--color_accent); /* 拇指的颜色，这里可以使用你的强调色 */
    cursor: pointer;
    margin-top: 0px; /* 调整拇指位置，使其居中于轨道 (轨道高度的一半 - 拇指高度的一半) */
    box-shadow: -200px 0 0 200px var(--color_accent); /* 阴影宽度不需要100vw，超过input宽度即可 */
  }
`;

export const AccentRange: React.FC<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange: (x: number) => void;
  }
> = (props) => (
  <Container>
    <SliderInput
      {...props}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange && props.onChange(+e.target.value);
      }}
    />
  </Container>
);
