import React from 'react';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * SolutionCodeBlock Component
 * Displays student's submitted code with syntax highlighting
 */
const SolutionCodeBlock = ({ code, language = 'cpp' }) => {
    return (
        <div className="solution-code-block" id="solution-code-block">
            <h3 className="code-block-title">My Results & Solution</h3>
            <div className="code-container">
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        borderRadius: '8px',
                        fontSize: '14px',
                        lineHeight: '1.5',
                    }}
                    showLineNumbers={false}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

SolutionCodeBlock.propTypes = {
    code: PropTypes.string.isRequired,
    language: PropTypes.string,
};

export default SolutionCodeBlock;
