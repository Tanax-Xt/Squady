import sys
from typing import BinaryIO


def is_size_in_range(file: BinaryIO, min_size: int = 0, max_size: int = sys.maxsize) -> bool:
    """Determines whether the size of the provided binary file is within the specified range.

    Args:
        file (BinaryIO): A binary object whose size is to be checked.
        min_size (int, optional): The minimum size in bytes. Defaults to 0.
        max_size (int, optional): The maximum size in bytes. Defaults to sys.maxsize.

    Returns:
        bool: A value indicating whether the file size is within the specified range.
    """

    contents = file.read()
    size = len(contents)

    return min_size <= size <= max_size


def is_pdf(content_type: str | None) -> bool:
    """Determines whether the provided content type indicates a pdf.

    Args:
        content_type (str | None): The content type of the file or data.

    Returns:
        bool: A value indicating whether pdf is in the content type.
    """

    return content_type is not None and "pdf" in content_type
